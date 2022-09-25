import db from "../database/connection.js";
import bcrypt from "bcrypt";
import bcrypt from "bcrypt";
//import { jwtTokens } from '../utils/jwt-helpers.js';

const router = express.Router();

async function post(req, res) {
  //const sid = crypto.randomBytes(18).toString("base64");

  try {
    //console.log(req.cookies, req.get('origin'));

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
    //JWT
    let tokens = jwtTokens(users.rows[0]); //Gets access and refresh tokens
    res.cookie("refresh_token", tokens.refreshToken, {
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.json(tokens);

    // //cookie test
    // res.cookie("sid", userInfo, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60, // 60,000ms (60s)
    //   sameSite: "lax",
    //   signed: true,
    // });
    //console.log(req.cookies);
    //console.log(req.signedCookies);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }

  res.redirect("/posts");
}

async function get(req, res) {
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
}

async function deleteToken(req, res) {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "Refresh token deleted." });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

export default { post, get, deleteToken };
