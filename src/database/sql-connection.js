import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2";

const dbConnect = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

export default dbConnect;
