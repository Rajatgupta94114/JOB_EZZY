import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');
const CONNECTIONS_FILE = path.join(DATA_DIR, 'connections.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Initialize data files if they don't exist
function initializeDataFiles() {
  ensureDataDir();

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
}

export function getUsers() {
  initializeDataFiles();
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data);
}

export function saveUsers(users: any[]) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function getJobs() {
  initializeDataFiles();
  const data = fs.readFileSync(JOBS_FILE, 'utf-8');
  return JSON.parse(data);
}

export function saveJobs(jobs: any[]) {
  ensureDataDir();
  fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2));
}

export function getApplications() {
  initializeDataFiles();
  const data = fs.readFileSync(APPLICATIONS_FILE, 'utf-8');
  return JSON.parse(data);
}

export function saveApplications(applications: any[]) {
  ensureDataDir();
  fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(applications, null, 2));
}

export function getConnections() {
  initializeDataFiles();
  const data = fs.readFileSync(CONNECTIONS_FILE, 'utf-8');
  return JSON.parse(data);
}

export function saveConnections(connections: any[]) {
  ensureDataDir();
  fs.writeFileSync(CONNECTIONS_FILE, JSON.stringify(connections, null, 2));
}

export function getMessages() {
  initializeDataFiles();
  const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
  return JSON.parse(data);
}

export function saveMessages(messages: any[]) {
  ensureDataDir();
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}
