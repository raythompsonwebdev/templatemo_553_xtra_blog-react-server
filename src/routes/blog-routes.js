import dbConnect from "../database/sql-connection.js";
import { generateToken, verifyJwt } from "../utils/JWT/generateToken.js";
import { hashPassword, comparePassword } from "../utils/EncryptPassword.js";
import dotenv from "dotenv";
dotenv.config();

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
  server.post("/api/register_user", async (request, response) => {
    const { username, email, hashpassword, submitted } = request.body;

    // check if username or email already exists
    dbConnect.query("SELECT * FROM users", (err, result) => {
      // if (err) response.status(500).json({ error: err.message });

      const existingUser = result.filter(
        (userExist) => userExist.username === username
      );

      if (existingUser.length > 0) {
        response.status(400);
        throw new Error("user already exists");
      }

      const existingEmail = result.filter(
        (emailExist) => emailExist.email === email
      );

      if (existingEmail.length > 0) {
        response.status(400);
        throw new Error("email already exists");
      }
    });

    const hashedPassword = await hashPassword(hashpassword);

    dbConnect.execute(
      `INSERT INTO users ( username, email, hashpassword, date_submitted) VALUES(?, ?, ?, ?)`,
      [username, email, hashedPassword, submitted],
      (err, result) => {
        if (err)
          response.status(401).json({ error: `RegisterUser :${err.message}` });

        !result
          ? console.log("No record inserted")
          : console.log("record inserted", result);
      }
    );
  });

  // login user route
  server.post("/api/login", async (request, response) => {
    const { username, password } = request.body;

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

          if (!validPassword) {
            return response.status(401).json({ error: "Incorrect password" });
          }

          const userInfo = {
            user_id: result[0].user_id,
            username: result[0].username,
            email: result[0].email,
          };

          generateToken(response, userInfo); //generate token and signed cookie

          response.status(200).json({ message: "User found" });
        } else {
          response.status(401).json({ message: "User doesn't exist" });
        }
      }
    );
  });

  // login user route
  server.post("/api/logout", async (request, response) => {
    response.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return response
      .status(200)
      .json({ loggedIn: false, message: "user logged out" });
  });

  // user profile route
  server.get("/api/profile", async (request, response) => {
    const { jwt } = request.signedCookies;

    if (!jwt) {
      return response.status(401).json({
        loggedIn: false,
        message: "user not authenticated",
      });
    } else {
      const verToke = verifyJwt(jwt);
      console.log(`token verified : ${verToke}`);
      return response.json({
        loggedIn: true,
        message: "user authenticated",
        token: verToke,
      });
    }
  });

  // update user profile
  // server.post("/api/update_profile", async (request, response) => {});
};

export default blogroutes;
