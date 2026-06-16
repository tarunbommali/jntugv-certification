import { db } from './backend/db/index.js';
import { sql } from 'drizzle-orm';

async function migrate() {
  console.log("Starting database migration...");
  
  try {
    // Check if column exists, then rename it
    await db.execute(sql`ALTER TABLE users CHANGE display_name username VARCHAR(191);`);
    console.log("Successfully renamed column `display_name` to `username`.");
  } catch (err) {
    console.log("Column might already be renamed or error occurred:", err.message);
  }

  // Fetch all users to sanitize usernames
  try {
    const users = await db.execute(sql`SELECT id, username FROM users WHERE username IS NOT NULL`);
    const userRows = users[0]; // mysql2 returns [rows, fields]
    
    let updated = 0;
    for (const user of userRows) {
      if (!user.username) continue;
      
      let newName = user.username;
      
      // Remove @ if it's there at the start temporarily
      const startsWithAt = newName.startsWith('@');
      if (startsWithAt) newName = newName.substring(1);
      
      // Replace spaces with underscores
      newName = newName.replace(/\s+/g, '_');
      // Remove any character that is not a-z, A-Z, 0-9, ., _
      newName = newName.replace(/[^a-zA-Z0-9._]/g, '');
      
      // Put @ back if the user wants @ everywhere? Wait, the UI has "@" prefix. 
      // If we store it WITH @, then regex should allow @. 
      // But let's just make the actual username not contain @ in DB, and UI prefixes it?
      // "while updating add @ before username" implies it's stored with @.
      if (startsWithAt) {
        newName = '@' + newName;
      }

      if (newName !== user.username) {
        await db.execute(sql`UPDATE users SET username = ${newName} WHERE id = ${user.id}`);
        updated++;
      }
    }
    console.log(`Sanitized ${updated} existing usernames.`);
  } catch (err) {
    console.log("Error during sanitization:", err.message);
  }
  
  console.log("Migration complete.");
  process.exit(0);
}

migrate();
