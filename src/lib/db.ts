import { MongoClient, Db } from 'mongodb';
import fs from 'fs';
import path from 'path';

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;

export async function getDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI is not defined. Falling back to local filesystem storage.');
    return null;
  }
  
  if (!mongoDb) {
    try {
      console.log('Connecting to MongoDB...');
      mongoClient = new MongoClient(uri, {
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
      });
      await mongoClient.connect();
      const dbName = uri.split('/').pop()?.split('?')[0] || 'learning_cms';
      mongoDb = mongoClient.db(dbName);
      console.log(`Successfully connected to MongoDB database: ${dbName}`);
    } catch (err) {
      console.error('Failed to connect to MongoDB, falling back to local file backup:', err);
      return null;
    }
  }
  return mongoDb;
}

const BACKUP_FILE_PATH = path.join(process.cwd(), 'cms_backup_local.json');

export function saveToLocalFile(data: any) {
  try {
    fs.writeFileSync(BACKUP_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Saved backup to local JSON file successfully.');
  } catch (err) {
    console.error('Failed to write local JSON backup file:', err);
  }
}

export function loadFromLocalFile(): any | null {
  try {
    if (fs.existsSync(BACKUP_FILE_PATH)) {
      const content = fs.readFileSync(BACKUP_FILE_PATH, 'utf-8');
      console.log('Loaded backup from local JSON file successfully.');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read local JSON backup file:', err);
  }
  return null;
}
