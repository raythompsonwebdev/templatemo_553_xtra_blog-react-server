import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import home from "./routes/home.js";
import createPost from "./routes/createPost.js";
import deletePost from "./routes/deletePost.js";
import updatePost from "./routes/updatePost.js";
import getPost from "./routes/getPost.js";
import logoutUser from "./routes/logoutUser.js";
import loginUser from "./routes/loginUser.js";
import registerUser from "./routes/registerUser.js";
import path from "path";
//import { dirname,join } from 'path';
import { fileURLToPath } from "url";
//import bodyParser from "body-parser";

dotenv.config();

//set up file paths for static files - updated
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//express server
const server = express();

//port
const PORT = process.env.PORT || 3333;

//cors options
const corsOptions = { credentials: false, origin: process.env.URL || "*" };
server.use(cors(corsOptions));

server.use(express.json());

// cookie parser
server.use(cookieParser("alongrandomstringnobodyelseknows"));

//Middleware - bodyparser setup updated
const bodyParser = express.urlencoded({ extended: false });
server.use(bodyParser);
// bodyparser old setup
//server.use(bodyParser.urlencoded({ extended: true }));
//server.use(bodyParser.json());

// serve static files
const staticHandler = express.static(path.join(__dirname, "public"));
server.use(staticHandler);

// this is for images folder on path images
const staticImages = express.static(path.join(__dirname, "public/static/img"));
server.use(staticImages);

//display blog posts
server.get("/api/posts", home);

// get single blog post
server.get("/api/post/:id", getPost);

//delete blog post
server.post("/api//posts/:id", deletePost);

// create blog post
server.post("/api//create-post", createPost);

// update single blog post
server.put("/api//update-post", updatePost);

// login login route
server.post("/api//login", loginUser.post);

// login logout route
server.post("/api//logout", logoutUser.get);

// register user route
server.post("/api//register-user", registerUser.post);

// get users route
server.get("/api//users", registerUser.get);

//error handling
server.use((request, response) => {
  const html = `
  <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Say Something Nice!</title>
        <link href="public/css/style.css" type="text/css" rel="stylesheet"> 
      </head>
      <body>
      <nav>
        <ul>
        <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/posts-add">add post</a>
          </li>
          
        </ul>
      </nav>
      <main>
      <h1>Not found</h1>
        
        </main>
      </body>
    </html>
  `;
  response.status(404).send(html);
});

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
