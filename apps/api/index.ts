import express from "express";
import { prisma } from "@repo/database";

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
    const respo = await prisma.user.findMany();
    return res.status(200).send(respo)
});

app.get("/status/:wensiteId", (req, res) => {
    return res.status(200).send("hi herelk")
});

app.post("/website", (req, res) => {
    return res.status(200).send("hi herelk")
});

app.listen(process.env.PORT || 3000);