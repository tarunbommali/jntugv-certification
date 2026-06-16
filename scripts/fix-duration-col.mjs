import { db } from '../backend/db/index.js';
import { sql } from 'drizzle-orm';

async function migrate() {
  try {
    await db.execute(sql`ALTER TABLE courses MODIFY COLUMN duration VARCHAR(64);`);
    console.log('Database updated successfully.');
  } catch (err) {
    console.error('Error updating database:', err);
  }
  process.exit(0);
}

migrate();
