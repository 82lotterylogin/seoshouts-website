import Database from 'better-sqlite3';
import path from 'path';
import { initializeAdminUser } from './auth';

let db: Database.Database;

export function getDatabase() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'blog.db');
    db = new Database(dbPath);
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Initialize tables
    initializeTables();
    
    // Initialize admin user
    initializeAdminUser().catch(console.error);
  }
  return db;
}

function initializeTables() {
  const createTables = `
    -- Authors table
    CREATE TABLE IF NOT EXISTS authors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      bio TEXT,
      avatar_url TEXT,
      job_title TEXT,
      location TEXT,
      phone TEXT,
      linkedin_url TEXT,
      twitter_url TEXT,
      website_url TEXT,
      company TEXT,
      expertise TEXT, -- JSON array of skills
      career_highlights TEXT, -- JSON array of career positions
      education TEXT,
      meta_title TEXT,
      meta_description TEXT,
      custom_schema TEXT, -- JSON custom schema
      seo_noindex INTEGER DEFAULT 0, -- 0 = false, 1 = true
      seo_nofollow INTEGER DEFAULT 0, -- 0 = false, 1 = true
      avatar_alt_text TEXT, -- Alt text for avatar image
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Categories table
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Articles table
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT,
      content TEXT NOT NULL,
      featured_image TEXT,
      featured_image_alt TEXT,
      meta_title TEXT,
      meta_description TEXT,
      author_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      status TEXT CHECK(status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
      published_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    -- Images table
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      alt_text TEXT,
      url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Redirections table
    CREATE TABLE IF NOT EXISTS redirections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_path TEXT NOT NULL UNIQUE,
      to_path TEXT NOT NULL,
      status_code INTEGER DEFAULT 301,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Article tags junction table
    CREATE TABLE IF NOT EXISTS article_tags (
      article_id INTEGER,
      tag TEXT,
      PRIMARY KEY (article_id, tag),
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
    CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
    CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
    CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
    CREATE INDEX IF NOT EXISTS idx_redirections_from ON redirections(from_path);
  `;

  db.exec(createTables);

  // Add featured_image_alt column if it doesn't exist
  try {
    db.exec('ALTER TABLE articles ADD COLUMN featured_image_alt TEXT');
  } catch (error) {
    // Column might already exist, which is fine
  }

  // Add new author fields if they don't exist
  const authorFields = [
    'job_title TEXT',
    'location TEXT', 
    'phone TEXT',
    'linkedin_url TEXT',
    'twitter_url TEXT',
    'website_url TEXT',
    'company TEXT',
    'expertise TEXT',
    'career_highlights TEXT',
    'education TEXT',
    'meta_title TEXT',
    'meta_description TEXT',
    'custom_schema TEXT',
    'seo_noindex INTEGER DEFAULT 0',
    'seo_nofollow INTEGER DEFAULT 0',
    'avatar_alt_text TEXT',
    'slug TEXT'
  ];

  authorFields.forEach(field => {
    try {
      db.exec(`ALTER TABLE authors ADD COLUMN ${field}`);
    } catch (error) {
      // Column might already exist, which is fine
    }
  });

  // Insert default author if none exists
  const authorExists = db.prepare('SELECT COUNT(*) as count FROM authors').get() as { count: number };
  if (authorExists.count === 0) {
    db.prepare(`
      INSERT INTO authors (name, email, bio)
      VALUES ('SEOShouts Team', 'seoshouts@gmail.com', 'Expert SEO professionals providing valuable insights and strategies.')
    `).run();
  }

  // Insert default category if none exists
  const categoryExists = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  if (categoryExists.count === 0) {
    db.prepare(`
      INSERT INTO categories (name, slug, description) 
      VALUES 
        ('SEO Tips', 'seo-tips', 'Latest SEO strategies and best practices'),
        ('Digital Marketing', 'digital-marketing', 'Comprehensive digital marketing insights'),
        ('Web Development', 'web-development', 'Technical SEO and web development guides'),
        ('Tools & Resources', 'tools-resources', 'Useful SEO tools and resources')
    `).run();
  }
}

// Close database connection on process exit
process.on('exit', () => {
  if (db) {
    db.close();
  }
});

process.on('SIGINT', () => {
  if (db) {
    db.close();
  }
  process.exit(0);
});

export default getDatabase;