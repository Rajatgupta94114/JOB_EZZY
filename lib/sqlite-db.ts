import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'jobezzy.db');
let db: Database.Database | null = null;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initializeTables();
  }
  return db;
}

function initializeTables() {
  const database = getDb();

  // Users table
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      email TEXT,
      role TEXT NOT NULL,
      walletAddress TEXT,
      telegramId TEXT,
      telegramUsername TEXT,
      tonDNS TEXT,
      rating REAL DEFAULT 0,
      pointsBalance INTEGER DEFAULT 0,
      sbtBalance INTEGER DEFAULT 0,
      kycStatus TEXT DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  // Jobs table
  database.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      company TEXT NOT NULL,
      createdBy TEXT NOT NULL,
      budget TEXT,
      currency TEXT DEFAULT 'TON',
      status TEXT DEFAULT 'open',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (createdBy) REFERENCES users(id)
    )
  `);

  // Applications table
  database.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      jobId TEXT NOT NULL,
      candidateId TEXT NOT NULL,
      candidateName TEXT NOT NULL,
      resume TEXT,
      details TEXT,
      status TEXT DEFAULT 'pending',
      escrowContractId TEXT,
      contractAccepted BOOLEAN DEFAULT 0,
      contractAcceptedAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (jobId) REFERENCES jobs(id),
      FOREIGN KEY (candidateId) REFERENCES users(id)
    )
  `);

  // Escrows table
  database.exec(`
    CREATE TABLE IF NOT EXISTS escrows (
      id TEXT PRIMARY KEY,
      applicationId TEXT NOT NULL,
      jobId TEXT NOT NULL,
      jobTitle TEXT NOT NULL,
      companyId TEXT NOT NULL,
      candidateId TEXT NOT NULL,
      amount TEXT NOT NULL,
      currency TEXT DEFAULT 'TON',
      description TEXT,
      terms TEXT,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      paymentStatus TEXT DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (applicationId) REFERENCES applications(id),
      FOREIGN KEY (jobId) REFERENCES jobs(id),
      FOREIGN KEY (companyId) REFERENCES users(id),
      FOREIGN KEY (candidateId) REFERENCES users(id)
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
      FOREIGN KEY (escrowId) REFERENCES escrows(id),
      FOREIGN KEY (companyId) REFERENCES users(id),
      FOREIGN KEY (candidateId) REFERENCES users(id)
    )
  `);

  // Ratings table
  database.exec(`
    CREATE TABLE IF NOT EXISTS ratings (
      id TEXT PRIMARY KEY,
      escrowId TEXT NOT NULL,
      companyId TEXT NOT NULL,
      candidateId TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (escrowId) REFERENCES escrows(id),
      FOREIGN KEY (companyId) REFERENCES users(id),
      FOREIGN KEY (candidateId) REFERENCES users(id)
    )
  `);

  // Notifications table
  database.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      recipientId TEXT NOT NULL,
      senderId TEXT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT,
      read BOOLEAN DEFAULT 0,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (recipientId) REFERENCES users(id),
      FOREIGN KEY (senderId) REFERENCES users(id)
    )
  `);

  // Messages table
  database.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversationId TEXT NOT NULL,
      senderId TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (senderId) REFERENCES users(id)
    )
  `);

  // Connections table
  database.exec(`
    CREATE TABLE IF NOT EXISTS connections (
      id TEXT PRIMARY KEY,
      userId1 TEXT NOT NULL,
      userId2 TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (userId1) REFERENCES users(id),
      FOREIGN KEY (userId2) REFERENCES users(id)
    )
  `);
}

// Users
export function getUsers() {
  const database = getDb();
  return database.prepare('SELECT * FROM users').all();
}

export function saveUsers(users: any[]) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO users 
    (id, name, username, email, role, walletAddress, telegramId, telegramUsername, tonDNS, rating, pointsBalance, sbtBalance, kycStatus, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  for (const user of users) {
    stmt.run(
      user.id, user.name, user.username, user.email, user.role, user.walletAddress,
      user.telegramId, user.telegramUsername, user.tonDNS, user.rating, user.pointsBalance,
      user.sbtBalance, user.kycStatus, user.createdAt, user.updatedAt
    );
  }
}

// Jobs
export function getJobs() {
  const database = getDb();
  return database.prepare('SELECT * FROM jobs').all();
}

export function saveJobs(jobs: any[]) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO jobs 
    (id, title, description, company, createdBy, budget, currency, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  for (const job of jobs) {
    stmt.run(
      job.id, job.title, job.description, job.company, job.createdBy, job.budget,
      job.currency, job.status, job.createdAt, job.updatedAt
    );
  }
}

// Applications
export function getApplications() {
  const database = getDb();
  return database.prepare('SELECT * FROM applications').all();
}

export function saveApplications(applications: any[]) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO applications 
    (id, jobId, candidateId, candidateName, resume, details, status, escrowContractId, contractAccepted, contractAcceptedAt, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  for (const app of applications) {
    stmt.run(
      app.id, app.jobId, app.candidateId, app.candidateName, JSON.stringify(app.resume),
      JSON.stringify(app.details), app.status, app.escrowContractId, app.contractAccepted ? 1 : 0,
      app.contractAcceptedAt, app.createdAt, app.updatedAt
    );
  }
}

// Escrows
export function getEscrows() {
  const database = getDb();
  return database.prepare('SELECT * FROM escrows').all();
}

export function saveEscrows(escrows: any[]) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO escrows 
    (id, applicationId, jobId, jobTitle, companyId, candidateId, amount, currency, description, terms, startDate, endDate, status, paymentStatus, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  for (const escrow of escrows) {
    stmt.run(
      escrow.id, escrow.applicationId, escrow.jobId, escrow.jobTitle, escrow.companyId,
      escrow.candidateId, escrow.amount, escrow.currency, escrow.description, escrow.terms,
      escrow.startDate, escrow.endDate, escrow.status, escrow.paymentStatus, escrow.createdAt, escrow.updatedAt
    );
  }
}

// Payments
export function getPayments() {
  const database = getDb();
  return database.prepare('SELECT * FROM payments').all();
}

export function savePayments(payments: any[]) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO payments 
    (id, escrowId, companyId, candidateId, amount, currency, candidateWalletAddress, transactionHash, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  for (const payment of payments) {
    stmt.run(
      payment.id, payment.escrowId, payment.companyId, payment.candidateId, payment.amount,
      payment.currency, payment.candidateWalletAddress, payment.transactionHash, payment.status,
      payment.createdAt, payment.updatedAt
    );
  }
}

// Ratings
export function getRatings() {
  const database = getDb();
  return database.prepare('SELECT * FROM ratings').all();
}

export function saveRatings(ratings: any[]) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO ratings 
    (id, escrowId, companyId, candidateId, rating, comment, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  for (const r of ratings) {
    stmt.run(
      r.id, r.escrowId, r.companyId, r.candidateId, r.rating, r.comment, r.createdAt, r.updatedAt
    );
  }
}

// Notifications
export function getNotifications() {
  const database = getDb();
  return database.prepare('SELECT * FROM notifications').all();
}

export function saveNotifications(notifications: any[]) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO notifications 
    (id, recipientId, senderId, type, title, message, read, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  for (const notif of notifications) {
    stmt.run(
      notif.id, notif.recipientId, notif.senderId, notif.type, notif.title,
      notif.message, notif.read ? 1 : 0, notif.createdAt
    );
  }
}

// Messages
export function getMessages() {
  const database = getDb();
  return database.prepare('SELECT * FROM messages').all();
}

export function saveMessages(messages: any[]) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO messages 
    (id, conversationId, senderId, content, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  for (const msg of messages) {
    stmt.run(msg.id, msg.conversationId, msg.senderId, msg.content, msg.createdAt);
  }
}

// Connections
export function getConnections() {
  const database = getDb();
  return database.prepare('SELECT * FROM connections').all();
}

export function saveConnections(connections: any[]) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO connections 
    (id, userId1, userId2, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  for (const conn of connections) {
    stmt.run(conn.id, conn.userId1, conn.userId2, conn.status, conn.createdAt, conn.updatedAt);
  }
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
