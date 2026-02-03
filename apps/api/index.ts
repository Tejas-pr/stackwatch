import express from "express";
import websiteRoute from "./src/routes/website.route";
import cors from "cors";
import authMiddleware from "./src/middleware/user.middleware";

const app = express();
app.use(express.json());

const envOrigins = process.env.MAINORIGINS;
const envOrigins2 = process.env.MAINORIGINS2;
const BACKEND_PORT = process.env.BACKEND_PORT || 3001;

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://4r5w0cht-3000.inc1.devtunnels.ms",
    "https://4r5w0cht-3001.inc1.devtunnels.ms",
    envOrigins,
    envOrigins2
];

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: {
//     error: true,
//     message: "Too many requests, please try again later.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// app.use(limiter);

// app.use(
//   cors({
//     origin: allowedOrigins,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     credentials: true,
//   }),
// );

app.use(cors());

app.use("/", authMiddleware, websiteRoute);

app.listen(BACKEND_PORT, () => {
    console.log(`App running on port: ${BACKEND_PORT}`)
});