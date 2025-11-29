#!/usr/bin/env node

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'jobezzy.db');
const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = OFF'); // Disable foreign keys during migration

console.log('🔄 Starting migration from JSON to SQLite...\n');

// Create tables
db.exec(`
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
  );

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
  );

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
  );

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
  );

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
  );

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
  );

  CREATE TABLE IF NOT EXISTS connections (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    connectedUserId TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (connectedUserId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversationId TEXT NOT NULL,
    senderId TEXT NOT NULL,
    recipientId TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (senderId) REFERENCES users(id),
    FOREIGN KEY (recipientId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

// Helper function to read JSON file
function readJSON(filename) {
  const filepath = path.join(DATA_DIR, filename);
  if (fs.existsSync(filepath)) {
    try {
      return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    } catch (e) {
      console.error(`❌ Error reading ${filename}:`, e.message);
      return [];
    }
  }
  return [];
}

// Migrate users
const users = readJSON('users.json');
if (users.length > 0) {
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, name, username, role, walletAddress, rating, pointsBalance, sbtBalance, kycStatus, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  users.forEach(user => {
    insertUser.run(
      user.id,
      user.name,
      user.username,
      user.role,
      user.walletAddress || null,
      user.rating || 0,
      user.pointsBalance || 0,
      user.sbtBalance || 0,
      user.kycStatus || 'pending',
      user.createdAt
    );
  });
  console.log(`✅ Migrated ${users.length} users`);
}

// Migrate jobs
const jobs = readJSON('jobs.json');
if (jobs.length > 0) {
  const insertJob = db.prepare(`
    INSERT OR REPLACE INTO jobs (id, title, description, company, location, salary, jobType, skills, createdBy, createdAt, applicants)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  jobs.forEach(job => {
    insertJob.run(
      job.id,
      job.title,
      job.description || '',
      job.company,
      job.location || '',
      job.salary || '',
      job.jobType || '',
      JSON.stringify(job.skills || []),
      job.createdBy,
      job.createdAt,
      job.applicants || 0
    );
  });
  console.log(`✅ Migrated ${jobs.length} jobs`);
}

// Migrate applications
const applications = readJSON('applications.json');
if (applications.length > 0) {
  const insertApp = db.prepare(`
    INSERT OR REPLACE INTO applications (id, jobId, candidateId, candidateName, resume, details, status, createdAt, escrowContractId, contractAccepted, contractAcceptedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  applications.forEach(app => {
    insertApp.run(
      app.id,
      app.jobId,
      app.candidateId,
      app.candidateName || '',
      JSON.stringify(app.resume || {}),
      JSON.stringify(app.details || {}),
      app.status || 'pending',
      app.createdAt,
      app.escrowContractId || null,
      app.contractAccepted ? 1 : 0,
      app.contractAcceptedAt || null
    );
  });
  console.log(`✅ Migrated ${applications.length} applications`);
}

// Migrate escrow
const escrows = readJSON('escrow.json');
if (escrows.length > 0) {
  const insertEscrow = db.prepare(`
    INSERT OR REPLACE INTO escrow (id, jobId, jobTitle, candidateId, companyId, amount, currency, description, terms, startDate, endDate, status, paymentStatus, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  escrows.forEach(escrow => {
    // Use applicationId as jobId if jobId is not present
    const jobId = escrow.jobId || escrow.applicationId || 'unknown';
    insertEscrow.run(
      escrow.id,
      jobId,
      escrow.jobTitle || '',
      escrow.candidateId,
      escrow.companyId,
      escrow.amount,
      escrow.currency || 'TON',
      escrow.description || '',
      escrow.terms || '',
      escrow.startDate,
      escrow.endDate,
      escrow.status || 'pending',
      escrow.paymentStatus || 'pending',
      escrow.createdAt
    );
  });
  console.log(`✅ Migrated ${escrows.length} escrows`);
}

// Migrate payments
const payments = readJSON('payments.json');
if (payments.length > 0) {
  const insertPayment = db.prepare(`
    INSERT OR REPLACE INTO payments (id, escrowId, companyId, candidateId, amount, currency, candidateWalletAddress, transactionHash, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  payments.forEach(payment => {
    insertPayment.run(
      payment.id,
      payment.escrowId,
      payment.companyId,
      payment.candidateId,
      payment.amount,
      payment.currency || 'TON',
      payment.candidateWalletAddress || null,
      payment.transactionHash || null,
      payment.status || 'pending',
      payment.createdAt,
      payment.updatedAt || payment.createdAt
    );
  });
  console.log(`✅ Migrated ${payments.length} payments`);
}

// Migrate ratings
const ratings = readJSON('ratings.json');
if (ratings.length > 0) {
  const insertRating = db.prepare(`
    INSERT OR REPLACE INTO ratings (id, escrowId, candidateId, companyId, rating, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  ratings.forEach(rating => {
    insertRating.run(
      rating.id,
      rating.escrowId,
      rating.candidateId,
      rating.companyId,
      rating.rating,
      rating.comment || '',
      rating.createdAt
    );
  });
  console.log(`✅ Migrated ${ratings.length} ratings`);
}

// Migrate connections
const connections = readJSON('connections.json');
if (connections.length > 0) {
  const insertConnection = db.prepare(`
    INSERT OR REPLACE INTO connections (id, userId, connectedUserId, status, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  connections.forEach(connection => {
    insertConnection.run(
      connection.id,
      connection.userId,
      connection.connectedUserId,
      connection.status || 'pending',
      connection.createdAt || connection.connectedAt || new Date().toISOString()
    );
  });
  console.log(`✅ Migrated ${connections.length} connections`);
}

// Migrate messages
const messages = readJSON('messages.json');
if (messages.length > 0) {
  const insertMessage = db.prepare(`
    INSERT OR REPLACE INTO messages (id, conversationId, senderId, recipientId, message, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  messages.forEach(message => {
    // Use receiverId if recipientId is not present, skip if still invalid
    const recipientId = message.recipientId || message.receiverId;
    if (recipientId && recipientId !== 'user') {
      insertMessage.run(
        message.id,
        message.conversationId,
        message.senderId,
        recipientId,
        message.message,
        message.timestamp || message.createdAt || new Date().toISOString()
      );
    }
  });
  console.log(`✅ Migrated ${messages.length} messages`);
}

// Migrate notifications
const notifications = readJSON('notifications.json');
if (notifications.length > 0) {
  const insertNotification = db.prepare(`
    INSERT OR REPLACE INTO notifications (id, userId, type, title, message, read, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  notifications.forEach(notification => {
    // Use recipientId if userId is not present
    const userId = notification.userId || notification.recipientId;
    if (userId) {
      insertNotification.run(
        notification.id,
        userId,
        notification.type,
        notification.title,
        notification.message,
        notification.read ? 1 : 0,
        notification.createdAt
      );
    }
  });
  console.log(`✅ Migrated ${notifications.length} notifications`);
}

db.close();
console.log('\n✨ Migration completed successfully!');
console.log(`📁 Database saved to: ${DB_PATH}`);
