import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
//import session from "express-session";
import rateLimit from "express-rate-limit";
//set up file paths for static files - updated
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//routes
import blogroutes from "./routes/blog-routes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

//express server
const server = express();
server.use(express.json());

// for parsing cookies
server.use(cookieParser(process.env.COOKIE_SECRET));

// Cross Origin Resource Sharing
const whitelist = [process.env.URL, "http://localhost:5173"];
//cors options
const corsOptions = {
  origin: whitelist,
  methods: ["GET", "POST"],
  credentials: true,
};

server.use(cors(corsOptions));

// port
const PORT = process.env.PORT || 5000;

// limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
server.use(limiter);

// routes
blogroutes(server);

// for parsing application/xwww-form-urlencoded
server.use(bodyParser.urlencoded({ extended: true }));

//
// server.use(
//   session({
//     key: "userId",
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       expires: 60 * 60 * 24,
//     },
//   })
// );

// serve static files
const staticHandler = express.static(path.join(__dirname, "public"));
server.use(staticHandler);

// Error handler
server.use(notFound);
server.use(errorHandler);

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
