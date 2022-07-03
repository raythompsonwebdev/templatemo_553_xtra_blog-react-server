import db  from "../database/connection.js";
import bcrypt from "bcrypt";
//import crypto from "crypto";

async function post(req, res) {  

  //
  //const sid = crypto.randomBytes(18).toString("base64");
      
  try {    
    
    const { email, hashpassword } = req.body;
    const users = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (users.rows.length === 0) return res.status(401).json({error:"Email is incorrect"});
    //PASSWORD CHECK
    const validPassword = bcrypt.compareSync(hashpassword, users.rows[0].hashpassword);
    
    if (!validPassword) return res.status(401).json({error: "Incorrect password"});  

    const userInfo = {
      email:"email",
      password:"passowrd"
    };
            
    //cookie test
    res.cookie("sid", userInfo, {
      httpOnly: true,
      maxAge: 1000 * 60, // 60,000ms (60s)
      sameSite: "lax",
      signed: true
    });
  
    //console.log(req.cookies);
    console.log(req.signedCookies);

  } catch (error) {
    res.status(401).json({error: error.message});
  }

  res.redirect("/posts");

}

export default {post};
