import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'jobezzy.db');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    ensureDataDir();
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  const database = getDatabase();

  // Users table
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      walletAddress TEXT,
      rating REAL DEFAULT 0,
      pointsBalance INTEGER DEFAULT 0,
      sbtBalance INTEGER DEFAULT 0,
      kycStatus TEXT DEFAULT 'pending',
      createdAt TEXT NOT NULL
    )
  `);

  // Jobs table
  database.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      company TEXT NOT NULL,
      location TEXT,
      salary TEXT,
      jobType TEXT,
      skills TEXT,
      createdBy TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      applicants INTEGER DEFAULT 0,
      FOREIGN KEY (createdBy) REFERENCES users(id)
    )
  `);

  // Applications table
  database.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      jobId TEXT NOT NULL,
      candidateId TEXT NOT NULL,
      candidateName TEXT,
      resume TEXT,
      details TEXT,
      status TEXT DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      escrowContractId TEXT,
      contractAccepted INTEGER DEFAULT 0,
      contractAcceptedAt TEXT,
      FOREIGN KEY (jobId) REFERENCES jobs(id),
      FOREIGN KEY (candidateId) REFERENCES users(id)
    )
  `);

  // Escrow table
  database.exec(`
    CREATE TABLE IF NOT EXISTS escrow (
      id TEXT PRIMARY KEY,
      jobId TEXT NOT NULL,
      jobTitle TEXT,
      candidateId TEXT NOT NULL,
      companyId TEXT NOT NULL,
      amount TEXT NOT NULL,
      currency TEXT DEFAULT 'TON',
      description TEXT,
      terms TEXT,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      paymentStatus TEXT DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      FOREIGN KEY (jobId) REFERENCES jobs(id),
      FOREIGN KEY (candidateId) REFERENCES users(id),
      FOREIGN KEY (companyId) REFERENCES users(id)
    )
  `);

  // Payments table
  database.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      escrowId TEXT NOT NULL,
      companyId TEXT NOT NULL,
      candidateId TEXT NOT NULL,
      amount TEXT NOT NULL,
      currency TEXT DEFAULT 'TON',
      candidateWalletAddress TEXT,
      transactionHash TEXT,
      status TEXT DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (escrowId) REFERENCES escrow(id),
      FOREIGN KEY (companyId) REFERENCES users(id),
      FOREIGN KEY (candidateId) REFERENCES users(id)
    )
  `);

  // Ratings table
  database.exec(`
    CREATE TABLE IF NOT EXISTS ratings (
      id TEXT PRIMARY KEY,
      escrowId TEXT NOT NULL,
      candidateId TEXT NOT NULL,
      companyId TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (escrowId) REFERENCES escrow(id),
      FOREIGN KEY (candidateId) REFERENCES users(id),
      FOREIGN KEY (companyId) REFERENCES users(id)
    )
  `);

  // Connections table
  database.exec(`
    CREATE TABLE IF NOT EXISTS connections (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      connectedUserId TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (connectedUserId) REFERENCES users(id)
    )
  `);

  // Messages table
  database.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversationId TEXT NOT NULL,
      senderId TEXT NOT NULL,
      recipientId TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (senderId) REFERENCES users(id),
      FOREIGN KEY (recipientId) REFERENCES users(id)
    )
  `);

  // Notifications table
  database.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
}

// User operations
export function getUsers() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM users').all();
}

export function getUserById(id: string) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export function saveUser(user: any) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO users (id, name, username, role, walletAddress, rating, pointsBalance, sbtBalance, kycStatus, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(user.id, user.name, user.username, user.role, user.walletAddress || null, user.rating || 0, user.pointsBalance || 0, user.sbtBalance || 0, user.kycStatus || 'pending', user.createdAt);
  return user;
}

export function saveUsers(users: any[]) {
  users.forEach(user => saveUser(user));
}

// Job operations
export function getJobs() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM jobs').all();
}

export function getJobById(id: string) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
}

export function saveJob(job: any) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO jobs (id, title, description, company, location, salary, jobType, skills, createdBy, createdAt, applicants)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(job.id, job.title, job.description || '', job.company, job.location || '', job.salary || '', job.jobType || '', JSON.stringify(job.skills || []), job.createdBy, job.createdAt, job.applicants || 0);
  return job;
}

export function saveJobs(jobs: any[]) {
  jobs.forEach(job => saveJob(job));
}

// Application operations
export function getApplications() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM applications').all();
}

export function getApplicationById(id: string) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM applications WHERE id = ?').get(id);
}

export function saveApplication(app: any) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO applications (id, jobId, candidateId, candidateName, resume, details, status, createdAt, escrowContractId, contractAccepted, contractAcceptedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(app.id, app.jobId, app.candidateId, app.candidateName || '', JSON.stringify(app.resume || {}), JSON.stringify(app.details || {}), app.status || 'pending', app.createdAt, app.escrowContractId || null, app.contractAccepted ? 1 : 0, app.contractAcceptedAt || null);
  return app;
}

export function saveApplications(applications: any[]) {
  applications.forEach(app => saveApplication(app));
}

// Escrow operations
export function getEscrows() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM escrow').all();
}

export function getEscrowById(id: string) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM escrow WHERE id = ?').get(id);
}

export function saveEscrow(escrow: any) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO escrow (id, jobId, jobTitle, candidateId, companyId, amount, currency, description, terms, startDate, endDate, status, paymentStatus, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(escrow.id, escrow.jobId, escrow.jobTitle || '', escrow.candidateId, escrow.companyId, escrow.amount, escrow.currency || 'TON', escrow.description || '', escrow.terms || '', escrow.startDate, escrow.endDate, escrow.status || 'pending', escrow.paymentStatus || 'pending', escrow.createdAt);
  return escrow;
}

export function saveEscrows(escrows: any[]) {
  escrows.forEach(escrow => saveEscrow(escrow));
}

// Payment operations
export function getPayments() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM payments').all();
}

export function getPaymentById(id: string) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM payments WHERE id = ?').get(id);
}

export function savePayment(payment: any) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO payments (id, escrowId, companyId, candidateId, amount, currency, candidateWalletAddress, transactionHash, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(payment.id, payment.escrowId, payment.companyId, payment.candidateId, payment.amount, payment.currency || 'TON', payment.candidateWalletAddress || null, payment.transactionHash || null, payment.status || 'pending', payment.createdAt, payment.updatedAt || payment.createdAt);
  return payment;
}

export function savePayments(payments: any[]) {
  payments.forEach(payment => savePayment(payment));
}

// Rating operations
export function getRatings() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM ratings').all();
}

export function getRatingById(id: string) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM ratings WHERE id = ?').get(id);
}

export function saveRating(rating: any) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO ratings (id, escrowId, candidateId, companyId, rating, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(rating.id, rating.escrowId, rating.candidateId, rating.companyId, rating.rating, rating.comment || '', rating.createdAt);
  return rating;
}

export function saveRatings(ratings: any[]) {
  ratings.forEach(rating => saveRating(rating));
}

// Connection operations
export function getConnections() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM connections').all();
}

export function saveConnection(connection: any) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO connections (id, userId, connectedUserId, status, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(connection.id, connection.userId, connection.connectedUserId, connection.status || 'pending', connection.createdAt);
  return connection;
}

export function saveConnections(connections: any[]) {
  connections.forEach(connection => saveConnection(connection));
}

// Message operations
export function getMessages() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM messages').all();
}

export function saveMessage(message: any) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO messages (id, conversationId, senderId, recipientId, message, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(message.id, message.conversationId, message.senderId, message.recipientId, message.message, message.timestamp);
  return message;
}

export function saveMessages(messages: any[]) {
  messages.forEach(message => saveMessage(message));
}

// Notification operations
export function getNotifications() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM notifications').all();
}

export function saveNotification(notification: any) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO notifications (id, userId, type, title, message, read, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(notification.id, notification.userId, notification.type, notification.title, notification.message, notification.read ? 1 : 0, notification.createdAt);
  return notification;
}

export function saveNotifications(notifications: any[]) {
  notifications.forEach(notification => saveNotification(notification));
}

// Migration helper - import from JSON files
export function migrateFromJSON() {
  const jsonDb = require('./db');
  
  try {
    console.log('Starting migration from JSON to SQLite...');
    
    // Migrate users
    const users = jsonDb.getUsers();
    if (users.length > 0) {
      saveUsers(users);
      console.log(`✓ Migrated ${users.length} users`);
    }
    
    // Migrate jobs
    const jobs = jsonDb.getJobs();
    if (jobs.length > 0) {
      saveJobs(jobs);
      console.log(`✓ Migrated ${jobs.length} jobs`);
    }
    
    // Migrate applications
    const applications = jsonDb.getApplications();
    if (applications.length > 0) {
      saveApplications(applications);
      console.log(`✓ Migrated ${applications.length} applications`);
    }
    
    // Migrate connections
    const connections = jsonDb.getConnections();
    if (connections.length > 0) {
      saveConnections(connections);
      console.log(`✓ Migrated ${connections.length} connections`);
    }
    
    // Migrate messages
    const messages = jsonDb.getMessages();
    if (messages.length > 0) {
      saveMessages(messages);
      console.log(`✓ Migrated ${messages.length} messages`);
    }
    
    // Try to migrate other data if available
    try {
      const escrows = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'data', 'escrow.json'), 'utf-8'));
      if (escrows.length > 0) {
        saveEscrows(escrows);
        console.log(`✓ Migrated ${escrows.length} escrows`);
      }
    } catch (e) {}
    
    try {
      const payments = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'data', 'payments.json'), 'utf-8'));
      if (payments.length > 0) {
        savePayments(payments);
        console.log(`✓ Migrated ${payments.length} payments`);
      }
    } catch (e) {}
    
    try {
      const ratings = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'data', 'ratings.json'), 'utf-8'));
      if (ratings.length > 0) {
        saveRatings(ratings);
        console.log(`✓ Migrated ${ratings.length} ratings`);
      }
    } catch (e) {}
    
    try {
      const notifications = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'data', 'notifications.json'), 'utf-8'));
      if (notifications.length > 0) {
        saveNotifications(notifications);
        console.log(`✓ Migrated ${notifications.length} notifications`);
      }
    } catch (e) {}
    
    console.log('✓ Migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
  }
}
