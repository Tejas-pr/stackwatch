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

app.post("/website", async (req, res) => {
    try {
        const url = req.body.url;
        const user_id = req.user_id;
        if (!url) {
            return res.status(400).json({
                success: "false",
                message: "Please provide url!!"
            });
        }

        const response = await prisma.website.create({
            data: {
                url,
                user_id
            }
        });

        return res.status(200).json({
            success: "true",
            message: "Successfully added the url!!",
            id: response.id
        })

    } catch (e) {
        console.error(e)
    }
});

app.listen(process.env.PORT || 3000);