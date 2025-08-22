const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Paths
const dbPath = path.join(process.cwd(), 'blog.db');
const middlewarePath = path.join(process.cwd(), 'middleware.ts');

function syncRedirects() {
  try {
    console.log('🔄 Syncing redirects from database to middleware...');
    
    // Connect to database
    const db = new Database(dbPath);
    
    // Get all redirections
    const redirections = db.prepare('SELECT from_path, to_path, status_code FROM redirections').all();
    
    // Build redirections object
    let redirectsCode = '{\n';
    redirections.forEach(redirect => {
      redirectsCode += `  "${redirect.from_path}": { to: "${redirect.to_path}", statusCode: ${redirect.status_code} },\n`;
    });
    redirectsCode += '}';
    
    // Read current middleware file
    let middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
    
    // Replace the REDIRECTIONS object - improved regex to handle multiline content
    const regex = /const REDIRECTIONS: \{ \[key: string\]: \{ to: string; statusCode: number \} \} = \{[\s\S]*?\};/;
    const newRedirectionsConst = `const REDIRECTIONS: { [key: string]: { to: string; statusCode: number } } = ${redirectsCode};`;
    
    middlewareContent = middlewareContent.replace(regex, newRedirectionsConst);
    
    // Write back to middleware file
    fs.writeFileSync(middlewarePath, middlewareContent);
    
    db.close();
    
    console.log(`✅ Synced ${redirections.length} redirections to middleware`);
    console.log('📝 Redirections:', redirections.map(r => `${r.from_path} -> ${r.to_path}`));
    
  } catch (error) {
    console.error('❌ Error syncing redirects:', error);
  }
}

// Run the sync
syncRedirects();