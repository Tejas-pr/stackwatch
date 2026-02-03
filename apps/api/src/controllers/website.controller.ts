import { prisma } from "@repo/database";
import type { Request, Response } from "express";

export const getWebsiteDetails = async (req: Request, res: Response) => {
    try {
        const user_id = req.user_id;
        const website_id = String(req.params.websiteId);

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized!"
            });
        }

        if (!website_id) {
            return res.status(400).json({
                success: false,
                message: "Provide website ID"
            });
        }

        const response = await prisma.website.findMany({
            where: {
                user_id,
                id: website_id
            }
        });

        res.status(200).json({
            success: true,
            response
        });
    } catch (e: any) {
        return res.status(500).json({ message: e.message });
    }
}

export const Website = async (req: Request, res: Response) => {
    console.log(">>>>>>>>>>>>>>>>>>.user_iduser_iduser_id");
    try {
        const user_id = req.user_id;
        const url = req.body.url;

        console.log(">>>>>>>>>>>>>>>>>>.user_iduser_iduser_id", user_id, url)

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized!"
            });
        }

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