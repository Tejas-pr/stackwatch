import { prisma } from "@repo/database";
import type { Request, Response } from "express";

export const getWebsiteDetails = async (req: Request, res: Response) => {
    try {

    } catch (e: any) {
        return res.status(500).json({ message: e.message });
    }
}

export const Website = async (req: Request, res: Response) => {
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
    } catch (e: any) {
        return res.status(500).json({ message: e.message });
    }
}