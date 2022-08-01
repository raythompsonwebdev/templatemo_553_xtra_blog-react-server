import db from "../database/connection.js";
import bcrypt from "bcrypt";
//import {authenticateToken} from '../middleware/authorization.js';
//import { jwtTokens } from '../utils/jwt-helpers.js';

async function post(req, res) {
  //const sid = crypto.randomBytes(18).toString("base64");

  try {
    const { email, hashpassword } = req.body;

    const hashedPassword = await bcrypt.hash(hashpassword, 10);

    //const users = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    const users = await db.query(
      "INSERT INTO users (user_name,user_email,user_password) VALUES ($1,$2,$3) RETURNING *",
      [req.body.name, req.body.email, hashedPassword]
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
    //res.json(jwtTokens(newUser.rows[0]));

    //cookie test
    res.cookie("sid", userInfo, {
      httpOnly: true,
      maxAge: 1000 * 60, // 60,000ms (60s)
      sameSite: "lax",
      signed: true,
    });

    //console.log(req.cookies);
    console.log(req.signedCookies);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }

  res.redirect("/posts");
}

export default { post };
