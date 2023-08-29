import dbConnect from '../database/sql-connection.js'
import bcrypt from "bcrypt";

async function hashPassword(plaintextPassword) {
  const hash = await bcrypt.hash(plaintextPassword, 12)
  // Store hash in the database
  return hash
}

const registerUser = async (request, response) => {

  const { username, email, password, submitted } = request.body;
      
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = await hashPassword(password, salt);

  // console.log(username, email, hashedPassword, submitted)    

  dbConnect.execute(`INSERT INTO users ( username, email, hashpassword, date_submitted) VALUES(?, ?, ?, ?)`,[username, email, hashedPassword, submitted], (err, result) => {
    if (err) response.status(500).json({ error: `RegisterUser :${err.message}` });
      console.log("record inserted", result);
      return response.json({status: "success"})
    
  });
  
}

export default registerUser;
