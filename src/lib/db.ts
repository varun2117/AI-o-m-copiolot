import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = process.env.DATABASE_URL || './sqlite.db';
const db = new Database(dbPath);

// Initialize DB with schema if it's empty
const schemaPath = path.join(process.cwd(), 'schema.sql');
if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);
}

export default db;