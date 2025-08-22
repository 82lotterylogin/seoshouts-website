import fs from 'fs';
import path from 'path';
import { getDatabase } from './database';

const CACHE_FILE_PATH = path.join(process.cwd(), 'redirections-cache.json');

export interface RedirectionCache {
  [fromPath: string]: {
    to: string;
    statusCode: number;
  };
}

export async function updateRedirectionsCache(): Promise<void> {
  try {
    const db = getDatabase();
    
    // Fetch all redirections from database
    const redirections = db.prepare('SELECT * FROM redirections').all() as Array<{
      from_path: string;
      to_path: string;
      status_code: number;
    }>;
    
    // Build cache object
    const cache: RedirectionCache = {};
    redirections.forEach(redirect => {
      cache[redirect.from_path] = {
        to: redirect.to_path,
        statusCode: redirect.status_code
      };
    });
    
    // Write to cache file
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2));
    
    console.log(`Updated redirections cache with ${redirections.length} redirections`);
  } catch (error) {
    console.error('Error updating redirections cache:', error);
  }
}

export function getRedirectionsCache(): RedirectionCache {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const cacheContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
      return JSON.parse(cacheContent);
    }
  } catch (error) {
    console.error('Error reading redirections cache:', error);
  }
  
  return {};
}