import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import websiteRoute from "./src/routes/website.route";
import authMiddleware from "./src/middleware/user.middleware";

const app = express();

const BACKEND_PORT = Number(process.env.BACKEND_PORT) || 3001;

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://4r5w0cht-3000.inc1.devtunnels.ms",
    "https://4r5w0cht-3001.inc1.devtunnels.ms",
    process.env.MAINORIGINS,
    process.env.MAINORIGINS2,
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);

app.set("trust proxy", 1); // important for rate limiter behind proxies
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: true,
        message: "Too many requests, please try again later.",
    },
});

app.use("/api", limiter);

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is healthy",
    });
});

app.use("/api", authMiddleware, websiteRoute);

app.listen(BACKEND_PORT, () => {
    console.log(`Server running on port ${BACKEND_PORT}`);
});