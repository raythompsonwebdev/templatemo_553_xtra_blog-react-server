// index.js
import 'dotenv/config';
import pg from "pg";

const { Pool } = pg;

let localPoolConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: 5432,

}

// local or remote database
const poolConfig = process.env.DATABASE_URL ? {
  connectionString:process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false}
} : localPoolConfig;

// Connect to the database
const db = new Pool(poolConfig);

// export the pool object so we can query the DB in other files
//module.exports = db;
export default db;
