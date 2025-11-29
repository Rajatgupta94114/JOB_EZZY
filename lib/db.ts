import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');
const CONNECTIONS_FILE = path.join(DATA_DIR, 'connections.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const ESCROWS_FILE = path.join(DATA_DIR, 'escrows.json');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
const RATINGS_FILE = path.join(DATA_DIR, 'ratings.json');

// In-memory fallback for Vercel (read-only filesystem)
let inMemoryData: any = {
  users: [],
  jobs: [],
  applications: [],
  connections: [],
  messages: [],
  escrows: [],
  payments: [],
  ratings: [],
};

const isVercel = process.env.VERCEL === '1';

// Ensure data directory exists
function ensureDataDir() {
  if (isVercel) return; // Skip on Vercel
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (error) {
    console.warn('Could not create data directory:', error);
  }
}

// Initialize data files if they don't exist
function initializeDataFiles() {
  if (isVercel) return; // Skip on Vercel, use in-memory data
  
  ensureDataDir();

  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    }

    if (!fs.existsSync(JOBS_FILE)) {
      fs.writeFileSync(JOBS_FILE, JSON.stringify([], null, 2));
    }

    if (!fs.existsSync(APPLICATIONS_FILE)) {
      fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify([], null, 2));
    }

    if (!fs.existsSync(CONNECTIONS_FILE)) {
      fs.writeFileSync(CONNECTIONS_FILE, JSON.stringify([], null, 2));
    }

    if (!fs.existsSync(MESSAGES_FILE)) {
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
    }

    if (!fs.existsSync(ESCROWS_FILE)) {
      fs.writeFileSync(ESCROWS_FILE, JSON.stringify([], null, 2));
    }

    if (!fs.existsSync(PAYMENTS_FILE)) {
      fs.writeFileSync(PAYMENTS_FILE, JSON.stringify([], null, 2));
    }

    if (!fs.existsSync(RATINGS_FILE)) {
      fs.writeFileSync(RATINGS_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.warn('Could not initialize data files:', error);
  }
}

export function getUsers() {
  if (isVercel) return inMemoryData.users;
  
  initializeDataFiles();
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Error reading users:', error);
    return [];
  }
}

export function saveUsers(users: any[]) {
  if (isVercel) {
    inMemoryData.users = users;
    return;
  }
  
  ensureDataDir();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.warn('Error saving users:', error);
  }
}

export function getJobs() {
  if (isVercel) return inMemoryData.jobs;
  
  initializeDataFiles();
  try {
    const data = fs.readFileSync(JOBS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Error reading jobs:', error);
    return [];
  }
}

export function saveJobs(jobs: any[]) {
  if (isVercel) {
    inMemoryData.jobs = jobs;
    return;
  }
  
  ensureDataDir();
  try {
    fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2));
  } catch (error) {
    console.warn('Error saving jobs:', error);
  }
}

export function getApplications() {
  if (isVercel) return inMemoryData.applications;
  
  initializeDataFiles();
  try {
    const data = fs.readFileSync(APPLICATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Error reading applications:', error);
    return [];
  }
}

export function saveApplications(applications: any[]) {
  if (isVercel) {
    inMemoryData.applications = applications;
    return;
  }
  
  ensureDataDir();
  try {
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(applications, null, 2));
  } catch (error) {
    console.warn('Error saving applications:', error);
  }
}

export function getConnections() {
  if (isVercel) return inMemoryData.connections;
  
  initializeDataFiles();
  try {
    const data = fs.readFileSync(CONNECTIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Error reading connections:', error);
    return [];
  }
}

export function saveConnections(connections: any[]) {
  if (isVercel) {
    inMemoryData.connections = connections;
    return;
  }
  
  ensureDataDir();
  try {
    fs.writeFileSync(CONNECTIONS_FILE, JSON.stringify(connections, null, 2));
  } catch (error) {
    console.warn('Error saving connections:', error);
  }
}

export function getMessages() {
  if (isVercel) return inMemoryData.messages;
  
  initializeDataFiles();
  try {
    const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Error reading messages:', error);
    return [];
  }
}

export function saveMessages(messages: any[]) {
  if (isVercel) {
    inMemoryData.messages = messages;
    return;
  }
  
  ensureDataDir();
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.warn('Error saving messages:', error);
  }
}

export function getEscrows() {
  if (isVercel) return inMemoryData.escrows;
  
  initializeDataFiles();
  try {
    const data = fs.readFileSync(ESCROWS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Error reading escrows:', error);
    return [];
  }
}

export function saveEscrows(escrows: any[]) {
  if (isVercel) {
    inMemoryData.escrows = escrows;
    return;
  }
  
  ensureDataDir();
  try {
    fs.writeFileSync(ESCROWS_FILE, JSON.stringify(escrows, null, 2));
  } catch (error) {
    console.warn('Error saving escrows:', error);
  }
}

export function getPayments() {
  if (isVercel) return inMemoryData.payments;
  
  initializeDataFiles();
  try {
    const data = fs.readFileSync(PAYMENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Error reading payments:', error);
    return [];
  }
}

export function savePayments(payments: any[]) {
  if (isVercel) {
    inMemoryData.payments = payments;
    return;
  }
  
  ensureDataDir();
  try {
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2));
  } catch (error) {
    console.warn('Error saving payments:', error);
  }
}

export function getRatings() {
  if (isVercel) return inMemoryData.ratings;
  
  initializeDataFiles();
  try {
    const data = fs.readFileSync(RATINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Error reading ratings:', error);
    return [];
  }
}

export function saveRatings(ratings: any[]) {
  if (isVercel) {
    inMemoryData.ratings = ratings;
    return;
  }
  
  ensureDataDir();
  try {
    fs.writeFileSync(RATINGS_FILE, JSON.stringify(ratings, null, 2));
  } catch (error) {
    console.warn('Error saving ratings:', error);
  }
}
