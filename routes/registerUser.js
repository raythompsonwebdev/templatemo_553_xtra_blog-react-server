import db from "../database/connection.js";
import bcrypt from "bcrypt";
//import {authenticateToken} from '../middleware/authorization.js';
//import { jwtTokens } from '../utils/jwt-helpers.js';
//let refreshTokens = [];

async function post(request, response) {
  try {
    const { username, email, hashpassword, datesubmitted } = request.body;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(hashpassword, salt);
    const newUser = await db.query(
      `INSERT INTO users ( username, email, hashpassword, date_submitted) VALUES ($1, $2, $3, $4)`,
      [username, email, hashedPassword, datesubmitted]
    );

    response.json({ users: newUser.rows[0] });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }

  //response.redirect("http://localhost:3000");
}

//router.get("/users", async (req,res) =>{
async function get(req, res) {
  try {
    const users = await db.query("SELECT * from users");
    res.json({ users: users.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default { post, get };
