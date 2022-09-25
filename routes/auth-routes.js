import express from "express";
import jwt from "jsonwebtoken";
import pool from "../database/connection.js";
import bcrypt from "bcrypt";
import { jwtTokens } from "../utils/jwt-helpers.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, hashpassword } = req.body;

    const hashedPassword = await bcrypt.hash(hashpassword, 10);

    const users = await pool.query(
      "INSERT INTO users user_email,user_password) VALUES ($1,$2,$3) RETURNING *",
      [req.body.email, hashedPassword]
    );

    if (users.rows.length === 0)
      return res.status(401).json({ error: "Email is incorrect" });

    //PASSWORD CHECK
    const validPassword = bcrypt.compareSync(
      hashpassword,
      users.rows[0].hashpassword
    );

    if (!validPassword)
      return res.status(401).json({ error: "Incorrect password" });

    const userInfo = {
      email: "email",
      password: "passowrd",
    };

    //jwt token
    let tokens = jwtTokens(users.rows[0]); //Gets access and refresh tokens
    res.cookie("refresh_token", tokens.refreshToken, {
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    // return jwt token
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.get("/refresh_token", (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    console.log(req.cookies);
    if (refreshToken === null) return res.sendStatus(401);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, user) => {
        if (error) return res.status(403).json({ error: error.message });
        let tokens = jwtTokens(user);
        res.cookie("refresh_token", tokens.refreshToken, {
          ...(process.env.COOKIE_DOMAIN && {
            domain: process.env.COOKIE_DOMAIN,
          }),
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        return res.json(tokens);
      }
    );
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.delete("/refresh_token", (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "Refresh token deleted." });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

export default router;
