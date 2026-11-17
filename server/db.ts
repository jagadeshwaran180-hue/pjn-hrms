import fs from 'node:fs';
import path from 'node:path';
import type { DatabaseSchema } from './types.ts';
import { initialDatabaseData } from './seedData.ts';

const baseDir = import.meta.dirname || path.resolve('.');
// Default DB location
let currentDbPath = path.resolve(baseDir, 'data', 'hrms_db.json');

// Write mutex lock to prevent file race conditions
let writeLock: Promise<void> = Promise.resolve();

export function setDatabasePath(newPath: string) {
  currentDbPath = newPath;
}

export function getDatabasePath(): string {
  return currentDbPath;
}

/**
 * Initializes the database on disk if it does not exist.
 */
export function initDB(): DatabaseSchema {
  const dir = path.dirname(currentDbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(currentDbPath)) {
    // Seed with deep copy of initial data
    const seed = JSON.parse(JSON.stringify(initialDatabaseData)) as DatabaseSchema;
    const json = JSON.stringify(seed, null, 2);
    fs.writeFileSync(currentDbPath, json, 'utf-8');
    return seed;
  }

  try {
    const raw = fs.readFileSync(currentDbPath, 'utf-8');
    return JSON.parse(raw) as DatabaseSchema;
  } catch (err) {
    console.error(`[DB] Error parsing existing database at ${currentDbPath}, reseeding:`, err);
    const seed = JSON.parse(JSON.stringify(initialDatabaseData)) as DatabaseSchema;
    fs.writeFileSync(currentDbPath, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

/**
 * Read the current database state from disk.
 */
export function getDB(): DatabaseSchema {
  return initDB();
}

/**
 * Transactionally modify and persist database changes to disk.
 * Uses atomic rename to ensure durability.
 */
export async function updateDB<T = DatabaseSchema>(
  updater: (db: DatabaseSchema) => T | Promise<T>
): Promise<T> {
  let result: T;

  // Queue write operations through lock
  const prevLock = writeLock;
  let releaseLock: () => void = () => {};
  writeLock = new Promise<void>((resolve) => {
    releaseLock = resolve;
  });

  try {
    await prevLock;
    const db = getDB();
    result = await updater(db);

    const dir = path.dirname(currentDbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const tempFile = `${currentDbPath}.${Date.now()}.${Math.random().toString(36).substring(2, 7)}.tmp`;
    const serialized = JSON.stringify(db, null, 2);
    fs.writeFileSync(tempFile, serialized, 'utf-8');
    fs.renameSync(tempFile, currentDbPath);

    return result;
  } finally {
    releaseLock();
  }
}

/**
 * Resets the database to initial mock state (useful for tests and demo environments).
 */
export async function resetDB(): Promise<DatabaseSchema> {
  return updateDB((db) => {
    const seed = JSON.parse(JSON.stringify(initialDatabaseData)) as DatabaseSchema;
    Object.assign(db, seed);
    return db;
  });
}
