import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'jobezzy.db');
let db: Database.Database | null = null;

function getDb() {
  if (!db) {
    try {
      db = new Database(DB_PATH);
      db.pragma('journal_mode = WAL');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
  return db;
}

// Users
export function getUsers() {
  try {
    const database = getDb();
    return database.prepare('SELECT * FROM users').all();
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

export function saveUsers(users: any[]) {
  try {
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
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

// Jobs
export function getJobs() {
  try {
    const database = getDb();
    return database.prepare('SELECT * FROM jobs').all();
  } catch (error) {
    console.error('Error reading jobs:', error);
    return [];
  }
}

export function saveJobs(jobs: any[]) {
  try {
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
  } catch (error) {
    console.error('Error saving jobs:', error);
  }
}

// Applications
export function getApplications() {
  try {
    const database = getDb();
    return database.prepare('SELECT * FROM applications').all();
  } catch (error) {
    console.error('Error reading applications:', error);
    return [];
  }
}

export function saveApplications(applications: any[]) {
  try {
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
  } catch (error) {
    console.error('Error saving applications:', error);
  }
}

// Escrows
export function getEscrows() {
  try {
    const database = getDb();
    return database.prepare('SELECT * FROM escrows').all();
  } catch (error) {
    console.error('Error reading escrows:', error);
    return [];
  }
}

export function saveEscrows(escrows: any[]) {
  try {
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
  } catch (error) {
    console.error('Error saving escrows:', error);
  }
}

// Payments
export function getPayments() {
  try {
    const database = getDb();
    return database.prepare('SELECT * FROM payments').all();
  } catch (error) {
    console.error('Error reading payments:', error);
    return [];
  }
}

export function savePayments(payments: any[]) {
  try {
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
  } catch (error) {
    console.error('Error saving payments:', error);
  }
}

// Ratings
export function getRatings() {
  try {
    const database = getDb();
    return database.prepare('SELECT * FROM ratings').all();
  } catch (error) {
    console.error('Error reading ratings:', error);
    return [];
  }
}

export function saveRatings(ratings: any[]) {
  try {
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
  } catch (error) {
    console.error('Error saving ratings:', error);
  }
}

// Notifications
export function getNotifications() {
  try {
    const database = getDb();
    return database.prepare('SELECT * FROM notifications').all();
  } catch (error) {
    console.error('Error reading notifications:', error);
    return [];
  }
}

export function saveNotifications(notifications: any[]) {
  try {
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
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
}

// Messages
export function getMessages() {
  try {
    const database = getDb();
    return database.prepare('SELECT * FROM messages').all();
  } catch (error) {
    console.error('Error reading messages:', error);
    return [];
  }
}

export function saveMessages(messages: any[]) {
  try {
    const database = getDb();
    const stmt = database.prepare(`
      INSERT OR REPLACE INTO messages 
      (id, conversationId, senderId, content, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    for (const msg of messages) {
      stmt.run(msg.id, msg.conversationId, msg.senderId, msg.content, msg.createdAt);
    }
  } catch (error) {
    console.error('Error saving messages:', error);
  }
}

// Connections
export function getConnections() {
  try {
    const database = getDb();
    return database.prepare('SELECT * FROM connections').all();
  } catch (error) {
    console.error('Error reading connections:', error);
    return [];
  }
}

export function saveConnections(connections: any[]) {
  try {
    const database = getDb();
    const stmt = database.prepare(`
      INSERT OR REPLACE INTO connections 
      (id, userId1, userId2, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    for (const conn of connections) {
      stmt.run(conn.id, conn.userId1, conn.userId2, conn.status, conn.createdAt, conn.updatedAt);
    }
  } catch (error) {
    console.error('Error saving connections:', error);
  }
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
