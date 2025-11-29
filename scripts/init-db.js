const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../jobezzy.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Create all tables
db.exec(`
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
  );

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
  );

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
  );

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
    FOREIGN KEY (escrowId) REFERENCES escrows(id),
    FOREIGN KEY (companyId) REFERENCES users(id),
    FOREIGN KEY (candidateId) REFERENCES users(id)
  );

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
  );

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
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversationId TEXT NOT NULL,
    senderId TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (senderId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS connections (
    id TEXT PRIMARY KEY,
    userId1 TEXT NOT NULL,
    userId2 TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId1) REFERENCES users(id),
    FOREIGN KEY (userId2) REFERENCES users(id)
  );
`);

console.log('✅ Database initialized successfully!');
console.log('📊 Tables created:');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
tables.forEach(t => console.log(`   - ${t.name}`));

db.close();
