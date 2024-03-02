import dbConnect from "../database/sql-connection.js";
// import { signJwtAccessToken, verifyJwt } from "../utils/jwt-helpers.js";
import bcrypt from "bcrypt";

async function hashPassword(plaintextPassword) {
  const hash = await bcrypt.hash(plaintextPassword, 12);
  // Store hash in the database
  return hash;
}

async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}

// async function deleteToken(req, res) {
//   try {
//     res.clearCookie("refresh_token");
//     return res.status(200).json({ message: "Refresh token deleted." });
//   } catch (error) {
//     res.status(401).json({ error: error.message });
//   }
// }

const blogroutes = (server) => {
  //display all blog posts
  server.get("/api/posts", (request, response) => {
    dbConnect.query("SELECT * FROM blogpost", (err, result) => {
      if (err) response.status(500).json({ error: err.message });
      response.send(result);
    });
  });

  // register user route
  server.get("/api/search", (request, response) => {
    const { query } = request.query;

    dbConnect.execute(
      `SELECT * FROM blogpost WHERE blogtitle = ?`,
      [query],
      (err, result) => {
        if (err) response.status(500).json({ error: err.message });
        console.log(result);
        response.send(result);
      }
    );
  });

  // get single blog post
  server.get("/api/post/:id", (request, response) => {
    //let user = Number(req.params.id);
    const id = parseInt(request.params.id);

    dbConnect.query(
      `SELECT * FROM blogpost WHERE id = ${id}`,
      (err, result, fields) => {
        if (err) response.status(500).json({ error: err.message });
        //console.log(result[id]); show post from post array in returned from database.
        response.send(result);
      }
    );
  });

  //delete single blog post
  server.post("/api//post/:id", async (request, response) => {
    const id = parseInt(request.params.id);
    dbConnect.query(
      `DELETE * FROM blogpost WHERE id = ${id}`,
      (err, result, fields) => {
        if (err) response.status(500).json({ error: err.message });
        response.send(result);
      }
    );

    response.redirect("http://localhost:3000");
  });

  // create single blog post
  server.post("/api//add_post", async (request, response) => {
    const { author, blogtitle, blogpost, mood, submitted, categoryId } =
      request.body;
    dbConnect.query(
      `INSERT INTO blogposter(author, blogtitle, blogpost, submitted) VALUES (${author}, ${blogtitle}, ${blogpost}, ${mood}, ${submitted}, ${categoryId})`,
      (err, result, fields) => {
        if (err) response.status(500).json({ error: err.message });
        response.send(result);
      }
    );
    response.redirect("http://localhost:3000");
  });

  // update single blog post
  server.put("/api/update_post", async (request, response) => {
    const { id, name, blogtitle, blogpost, category, submitted } = request.body;

    dbConnect.query(
      ` 
        UPDATE blogposter 
        SET name = ${name}, 
        SET blogtitle = ${blogtitle}, 
        SET blogpost = ${blogpost}, 
        SET category = ${category}, 
        SET date = ${submitted}
        WHERE id = ${id}
      `,
      (err, result, fields) => {
        console.log(fields);
        if (err) response.status(500).json({ error: err.message });
        console.log(result);
        response.send(result);
      }
    );

    response.redirect("/posts");
  });

  // register user route
  server.post("/api/register_user", (req, res) => {
    // const { username, email, password, submitted } = request.body;

    console.log(req.body);

    // const saltRounds = 10;
    // const salt = bcrypt.genSaltSync(saltRounds);
    // const hashedPassword = await hashPassword(password, salt);

    // dbConnect.execute(
    //   `INSERT INTO users ( username, email, hashpassword, date_submitted) VALUES(?, ?, ?, ?)`,
    //   [username, email, hashedPassword, submitted],
    //   (err, result) => {
    //     if (err)
    //       response.status(500).json({ error: `RegisterUser :${err.message}` });
    //     console.log("record inserted", result);
    //     return response.json({ status: "success" });
    //   }
    // );
  });

  // login user route
  server.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    dbConnect.query(
      "SELECT * FROM users WHERE username = ? ",
      [username],
      (err, result) => {
        if (err)
          response.status(500).json({ err: `RegisterUser :${err.message}` });

        if (result.length > 0) {
          //PASSWORD CHECK - using sync method to compare - will try aync method
          const validPassword = comparePassword(
            password,
            result[0].hashpassword
          );

          if (!validPassword)
            return res.status(401).json({ error: "Incorrect password" });

          req.session.username = result[0].username;

          //console.log(`${result.length} record found`);
          return res
            .status(200)
            .json({ message: `${result.length} record found` });
        } else {
          res.status(401).json({ message: "User doesn't exist" });
        }
      }
    );
  });

  // user profile route
  server.get("/api/user", async (req, res, next) => {
    console.log("Cookies: ", req.cookies);
    // const { token } = req.cookies;
    // if (!token) {
    //   return res.json({ loggedIn: false, message: "user not authenticated" });
    // } else {
    //   const verToke = verifyJwt(token);
    //   console.log(`token verified : ${verToke}`);
    //   return res.json({ loggedIn: true });
    // }
    // next();
  });
};

export default blogroutes;
