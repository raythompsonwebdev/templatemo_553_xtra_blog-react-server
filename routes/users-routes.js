import express from "express";
import pool from "../database/connection.js";
import bcrypt from "bcrypt";
import { authenticateToken } from "../middleware/authorization.js";
import { jwtTokens } from "../utils/jwt-helpers.js";
import rateLimit from "express-rate-limit";

let refreshTokens = [];

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
router.use(limiter);

/* GET users listing. */
router.get("/", authenticateToken, async (req, res) => {
  try {
    console.log(req.cookies);
    const users = await pool.query("SELECT * FROM users");
    res.json({ users: users.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (user_name,user_email,user_password) VALUES ($1,$2,$3) RETURNING *",
      [req.body.name, req.body.email, hashedPassword]
    );
    res.json(jwtTokens(newUser.rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    const users = await pool.query("DELETE FROM users");
    res.status(204).json(users.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
