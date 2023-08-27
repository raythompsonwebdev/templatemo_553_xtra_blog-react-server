import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from 'body-parser';
import path from "path";
import { fileURLToPath } from "url";
import session from 'express-session'
// import rateLimit from "express-rate-limit";
import getAllPost from "./routes/getAllPost.js";
import createPost from "./routes/createPost.js";
import deletePost from "./routes/deletePost.js";
import updatePost from "./routes/updatePost.js";
import getPost from "./routes/getPost.js";
import searchPost from "./routes/searchPost.js";
import registerUser from "./routes/registerUser.js";
//import logoutUser from "./routes/logoutUser.js";
//import loginUser from "./routes/loginUser.js";
//import usersRouter from "./routes/users-routes.js";
//import authRouter from "./routes/auth-routes.js";

dotenv.config();

//set up file paths for static files - updated
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//express server
const server = express();

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

// // Apply the rate limiting middleware to all requests
// server.use(limiter);

//port
const PORT = process.env.PORT || 3333;

//cors options
const corsOptions = { 
  origin: [process.env.URL],
  methods:["GET", "POST"],
  credentials:true
};

server.use(cors(corsOptions));

// for parsing application/json
server.use(bodyParser.json());

// for parsing application/xwww-
server.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded


// serve static files
const staticHandler = express.static(path.join(__dirname, "public"));
server.use(staticHandler);

// // this is for images folder on path images
const staticImages = express.static(path.join(__dirname, "public/images"));
server.use(staticImages);

//display all blog posts
server.get("/api/posts", getAllPost);

//display searched blog posts
server.get("/api/posts", searchPost);

// get single blog post
server.get("/api/post/:id", getPost);

//delete single blog post
server.post("/api//post/:id", deletePost);

// create single blog post
server.post("/api//create-post", createPost);

// update single blog post
server.put("/api/update-post", updatePost);

// register user route
server.post("/api/registeruser", registerUser);

// register user route
server.get("/api/search", searchPost);

// login login route
//server.post("/api//login", loginUser.post);

// login logout route
//server.post("/api/logoutUser", logoutUser);

//auth routes
//server.use("/api/auth", authRouter); //login
//server.use("/api/users", usersRouter); // users

//error handling
// server.use((request, response) => {
//   const html = `
//   <!doctype html>
//     <html>
//       <head>
//         <meta charset="utf-8">
//         <title>Say Something Nice!</title>
//         <link href="public/css/style.css" type="text/css" rel="stylesheet"> 
//       </head>
//       <body>
//       <nav>
//         <ul>
//         <li>
//             <a href="/">Home</a>
//           </li>
//           <li>
//             <a href="/posts-add">add post</a>
//           </li>
          
//         </ul>
//       </nav>
//       <main>
//       <h1>Not found</h1>
        
//         </main>
//       </body>
//     </html>
//   `;
//   response.status(404).send(html);
// });

// Error handling function
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`Red alert! Red alert!: ${err.stack}`);
});

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
