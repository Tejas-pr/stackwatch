import { prisma } from "@repo/database";
import type { Request, Response } from "express";

export const getDashboardDetails = async (req: Request, res: Response) => {
    try {
        const user_id = req.user_id
        if (!user_id) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }

        const [totalSites, websites, totalTicks, upTicks] = await Promise.all([
            prisma.website.count({ where: { user_id } }),

            prisma.website.findMany({
                where: { user_id },
                select: {
                    id: true,
                    url: true,
                    timeAdded: true,
                    ticks: {
                        take: 1,
                        orderBy: { createdAt: "desc" },
                        select: {
                            status: true,
                            response_time_ms: true,
                            createdAt: true
                        }
                    }
                }
            }),

            prisma.websiteTicks.count({
                where: { website: { user_id } }
            }),

            prisma.websiteTicks.count({
                where: { website: { user_id }, status: "Up" }
            })
        ])

        const averageUptime =
            totalTicks === 0 ? 0 : Number(((upTicks / totalTicks) * 100).toFixed(2))

        const issues = websites.filter(
            w => w.ticks[0]?.status === "down"
        ).length

        return res.json({
            success: true,
            data: {
                totalSites,
                averageUptime,
                issues,
                websites
            }
        })
    } catch (e: any) {
        return res.status(500).json({ message: e.message })
    }
}

export const getWebsiteDetails = async (req: Request, res: Response) => {
    try {
        const user_id = req.user_id;
        const website_id = String(req.query.websiteId);
        const time_line = Number(req.query.timeline) || 1;

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

        if (time_line > 500) {
            return res.status(400).json({
                success: false,
                message: "timeline is huge, Please reduce the time line!!"
            });
        }

        const avg_response = await prisma.websiteTicks.aggregate({
            where: {
                website_id
            },
            _avg: {
                response_time_ms: true
            }
        });

        const region_metrics = await prisma.websiteTicks.groupBy({
            by: ["regain_id"],
            where: {
                website_id
            },
            _avg: {
                response_time_ms: true
            },
            _count: true
        });

        const response = await prisma.website.findMany({
            where: {
                user_id,
                id: website_id
            },
            include: {
                ticks: {
                    take: time_line,
                    orderBy: [
                        {
                            createdAt: "desc"
                        }
                    ]
                }
            }
        });

        if (!response) {
            res.status(200).json({
                success: true,
                message: "Not found!!"
            });
        }

        res.status(200).json({
            success: true,
            website_details: response,
            avg_response,
            region_metrics
        });
    } catch (e: any) {
        return res.status(500).json({ message: e.message });
    }
}

export const Website = async (req: Request, res: Response) => {
    try {
        const user_id = req.user_id;
        const url = req.body.url;

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
            response
        })
    } catch (e: any) {
        return res.status(500).json({ message: e.message });
    }
}