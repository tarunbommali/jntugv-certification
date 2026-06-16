/* eslint-disable no-console */
import mysql from 'mysql2';
import { drizzle } from 'drizzle-orm/mysql2';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import * as schema from './schema.js';
import { env } from '../config/env.js';

// Create a connection pool instead of a single connection for scalability and reliability
const poolConnection = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  port: env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, 
  idleTimeout: 60000, 
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

poolConnection.on('connection', (connection) => {
  // console.log('DB Connection established');
});

poolConnection.on('error', (err) => {
  console.error('Database pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error('Database has too many connections.');
  }
  if (err.code === 'ECONNREFUSED') {
    console.error('Database connection was refused.');
  }
});

const seedDefaultAdmin = async () => {
  const email = env.ADMIN_EMAIL?.trim();
  const password = env.ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    console.warn('⚠️  Skipping default admin seed. Provide ADMIN_EMAIL and ADMIN_PASSWORD env vars to auto-create an admin user.');
    return;
  }

  const client = poolConnection.promise();
  try {
    const [existing] = await client.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing && existing.length > 0) {
      console.log(`ℹ️  Admin user already exists for ${email}. Skipping seed.`);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const adminId = randomUUID();

    await client.query(
      `INSERT INTO users (
        id, email, password, display_name, first_name, last_name, 
        is_admin, is_active, auth_provider, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        adminId, email.toLowerCase(), passwordHash, 'Platform Admin', 'Admin', '', 
        1, 1, 'password'
      ]
    );

    console.log(`✅ Seeded default admin user (${email}). Remember to rotate ADMIN_PASSWORD after first login.`);
  } catch (err) {
    console.error('❌ Failed to seed default admin user:', err.message);
    // Suppress error if the table doesn't exist yet (first run before migrations)
    if (err.code !== 'ER_NO_SUCH_TABLE') {
      throw err;
    }
  }
};

export const db = drizzle(poolConnection.promise(), { schema, mode: 'default' });
export const sqlConnection = poolConnection;

// Refactored dbReady to just test the connection pool instead of executing DDL statements
export const dbReady = (async () => {
  try {
    // Acquire and release a connection to verify the pool is working
    const connection = await poolConnection.promise().getConnection();
    connection.release();
    console.log('✅ Database connection pool ready');
    
    // Attempt to seed admin (will skip if tables aren't migrated yet)
    await seedDefaultAdmin();
  } catch (error) {
    console.error('❌ Database initialization failed. Check credentials and ensure the database exists.');
    console.error(error.message);
    throw error;
  }
})();
