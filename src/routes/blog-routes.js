import dbConnect from "../database/sql-connection.js";
// import { verifyJwt } from "../utils/JWT/generateToken.js";
import { hashPassword, comparePassword } from "../utils/EncryptPassword.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const blogroutes = (server) => {
  //display all blog posts
  server.get("/api/posts", async (request, response) => {
    const [result] = await dbConnect.query("SELECT * FROM blogpost");
    response.send(result);
  });

  // register user route
  server.get("/api/search", async (request, response) => {
    const { query } = request.query;

    const [result] = await dbConnect.execute(
      `SELECT * FROM blogpost WHERE blogtitle = ?`,
      [query]
    );

    console.log(result);
    response.send(result);
  });

  // get single blog post
  server.get("/api/post/:id", async (request, response) => {
    //let user = Number(req.params.id);
    const id = parseInt(request.params.id);

    const [result] = await dbConnect.query(
      `SELECT * FROM blogpost WHERE id = ${id}`
    );

    response.send(result);
  });

  //delete single blog post
  server.post("/api//post/:id", async (request, response) => {
    const id = parseInt(request.params.id);
    const [result] = await dbConnect.query(
      `DELETE * FROM blogpost WHERE id = ${id}`
    );
    response.send(result);
    response.redirect("http://localhost:3000");
  });

  // create single blog post
  server.post("/api/add_post", async (request, response) => {
    const {
      author,
      username,
      blogtitle,
      blogpost,
      mood,
      submitted,
      blogimage,
      category_id,
      user_id,
    } = request.body;

    const [result] = await dbConnect.execute(
      `INSERT INTO blogpost (author, username, blogtitle, blogpost, mood , submitted, blogimage, category_id, user_id) VALUES( ?,?,?,?,?,?,?,?,?)`,
      [
        author,
        username,
        blogtitle,
        blogpost,
        mood,
        submitted,
        blogimage,
        category_id,
        user_id,
      ]
    );
    response.send(result);
  });

  // update single blog post
  server.put("/api/update_post", async (request, response) => {
    const { id, name, blogtitle, blogpost, category, submitted } = request.body;

    const [result] = await dbConnect.query(
      ` 
        UPDATE blogposter 
        SET name = ${name}, 
        SET blogtitle = ${blogtitle}, 
        SET blogpost = ${blogpost}, 
        SET category = ${category}, 
        SET date = ${submitted}
        WHERE id = ${id}
      `
    );
    response.send(result);
    response.redirect("/posts");
  });

  // register user route
  server.post("/api/register_user", async (request, response) => {
    const { username, email, hashpassword, submitted } = request.body;

    // check if username or email already exists
    const [checkUsername] = await dbConnect.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (checkUsername.length > 0) {
      return response.status(401).json({ error: "user already exists" });
    }

    const hashedPassword = await hashPassword(hashpassword);

    const is_verified = false;
    // INSERT INTO users (info) VALUES ('{"hairColor": "","favoriteFood": "","bio": ""}');
    const startingInfo = '{"bio": "", "hairColor": "", "favoriteFood": ""}';

    const [result] = await dbConnect.execute(
      `INSERT INTO users ( username, email, hashpassword, date_submitted, is_verified, info) VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, submitted, is_verified, startingInfo]
    );

    const { insertId } = result;

    console.log(result);

    jwt.sign(
      {
        user_id: insertId,
        username,
        email,
        is_verified: false,
        info: startingInfo,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "2d",
      },
      (err, token) => {
        if (err) {
          return response.status(401).send(err);
        }

        return response.status(200).json({ token, message: "user added" });
      }
    );

    // response.cookie("jwt", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    //   sameSite: "strict", // Prevent CSRF attacks
    //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    //   signed: true,
    // });

    //response.status(200).json({ message: "user added" });
  });

  // login user route
  server.post("/api/login", async (request, response) => {
    const { email, password } = request.body;

    const [user] = await dbConnect.query(
      "SELECT * FROM users WHERE email = ? ",
      [email]
    );

    const { user_id, username, hashpassword, is_verified, info } = user[0];

    if (user.length > 0) {
      //PASSWORD CHECK - using sync method to compare - will try aync method
      const validPassword = comparePassword(password, hashpassword);

      if (!validPassword) {
        return response.status(401).json({ error: "Incorrect password" });
      }

      jwt.sign(
        {
          user_id,
          username,
          email,
          is_verified,
          info,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "2d",
        },
        (err, token) => {
          if (err) {
            return response.status(500).send(err);
          }

          return response.status(200).json({ token, message: "User found" });
        }
      );

      // response.cookie("jwt", token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
      //   sameSite: "strict", // Prevent CSRF attacks
      //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      //   signed: true,
      // });
    } else {
      response.status(401).json({ message: "User doesn't exist" });
    }
  });

  // login user route
  server.post("/api/logout", async (request, response) => {
    // response.cookie("jwt", "", {
    //   httpOnly: true,
    //   expires: new Date(0),
    // });

    return response
      .status(200)
      .json({ loggedIn: false, message: "user logged out" });
  });

  server.put("/api/users/:userId", async (request, response) => {
    const { authorization } = request.headers;
    const { userId } = request.params;

    const updates = (({ favoriteFood, hairColor, bio }) => ({
      favoriteFood,
      hairColor,
      bio,
    }))(request.body);

    if (!authorization) {
      return response
        .status(401)
        .json({ message: "No authorization header sent" });
    }

    const token = authorization.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err)
        return response.status(401).json({ message: "Unable to verify token" });

      const { user_id } = decoded;

      console.log(decoded, user_id, userId);

      if (user_id !== userId)
        // console.log("Not allowed to update that user's data");
        return response
          .status(403)
          .json({ message: "Not allowed to update that user's data" });
    });

    const [result] = await dbConnect.query(
      ` UPDATE users SET info = JSON_SET(info, "$.favoriteFood", "${updates.favoriteFood}", "$.hairColor", "${updates.hairColor}" ,"$.bio", "${updates.bio}") WHERE user_id = ${userId}
        `
    );

    if (result.affectedRows > 0) {
      const [updatedInfo] = await dbConnect.query(
        `SELECT user_id, info, email, is_verified FROM users WHERE user_id = ${userId}`
      );

      // console.log(updatedInfo);

      const { user_id, email, is_verified, info } = updatedInfo;

      jwt.sign(
        { user_id, email, is_verified, info },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2d" },
        (err, token) => {
          if (err) {
            return response.status(200).json(err);
          }
          response.status(200).json({ token });
        }
      );
    }
  });

  // user profile route
  server.get("/api/profile", async (request, response) => {
    console.log(response.body);
    // const { jwt } = request.signedCookies;
    // console.log(jwt);

    // if (!jwt) {
    //   return response.status(401).json({
    //     loggedIn: false,
    //     message: "user not authenticated",
    //   });
    // } else {
    //   const verToke = verifyJwt(jwt);
    //   console.log(`token verified : ${verToke}`);
    //   return response.json({
    //     loggedIn: true,
    //     message: "user authenticated",
    //     token: verToke,
    //   });
    // }
    response.status(200).send("loggedin");
  });

  // get comments
  server.get("/api/comments", async (request, response) => {
    const [result] = await dbConnect.query("SELECT * FROM comments");
    response.send(result);
  });

  // post comments
  server.post("/api/comments", async (request, response) => {
    const { username, email, message, date } = request.body;

    const [result] = await dbConnect.execute(
      `INSERT INTO comments (username, email, message, date) VALUES(?,?,?,?)`,
      [username, email, message, date]
    );
    response.send(result);
  });
};

export default blogroutes;
