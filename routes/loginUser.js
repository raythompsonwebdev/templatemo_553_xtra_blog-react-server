import dbConnect from '../database/sql-connection.js'
import bcrypt from "bcrypt";
import {signJwtAccessToken, verifyJwt} from '../utils/jwt-helpers.js'

async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash)
  return result
}

const post = async (req, res) => {
  
  const { username, password} = req.body;
      
  dbConnect.query(
    "SELECT * FROM users WHERE username = ? ",
    [username],(err, result) => {
      if (err) response.status(500).json({ err: `RegisterUser :${err.message}` });      
                      
      if (result.length > 0) {
        //PASSWORD CHECK - using sync method to compare - will try aync method
        const validPassword = comparePassword(
          password,
          result[0].hashpassword
        );

        if (!validPassword)
          return res.status(401).json({ error: "Incorrect password" });

        req.session.username = result[0].username;
     
        const token  = signJwtAccessToken({username: req.session.username})

        res.cookie('token',token,{
          httpOnly: true,
          sameSite: "none",
          secure: true,
        })        
        //console.log(`${result.length} record found`);
        return res.status(200).json({message:`${result.length} record found`})        
        
      } else {
        res.status(401).json({ message: "User doesn't exist" });
      }  

   });  
}

const get = async (req, res, next) => {

  console.log('Cookies: ', req.cookies)
  const {token} = req.cookies;
  if (!token) {
    return res.json({ loggedIn: false, message:"user not authenticated"});    
  } else {
    const verToke = verifyJwt(token)
    console.log(`token verified : ${verToke}`)
    return res.json({ loggedIn: true });
  }
  next();
}

// async function deleteToken(req, res) {
//   try {
//     res.clearCookie("refresh_token");
//     return res.status(200).json({ message: "Refresh token deleted." });
//   } catch (error) {
//     res.status(401).json({ error: error.message });
//   }
// }

export default {post ,get} ;
