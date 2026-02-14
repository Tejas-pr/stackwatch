import { prisma } from "@repo/database";
import { getAverageResponse, getLatestTick, getRecentTicks, getRegionMetrics, getUptimeStats } from "@repo/timeseries-database/timeseries";
import type { Request, Response } from "express";

export const getDashboardDetails = async (req: Request, res: Response) => {
    const user_id = req.user_id;
    if (!user_id) return res.status(401).json({ success: false });

    const websites = await prisma.website.findMany({
        where: { user_id },
        select: { id: true, url: true, timeAdded: true }
    });

    const enriched = await Promise.all(
        websites.map(async (w) => {
            const latest = await getLatestTick(w.id);
            return {
                ...w,
                latest
            };
        })
    );

    const uptimeValues = await Promise.all(
        websites.map(w => getUptimeStats(w.id))
    );

    const averageUptime =
        uptimeValues.length === 0
            ? 0
            : Number(
                (
                    uptimeValues.reduce((a, b) => a + b, 0) /
                    uptimeValues.length
                ).toFixed(2)
            );

    const issues = enriched.filter(
        w => w.latest?.status === "Down"
    ).length;

    res.json({
        success: true,
        data: {
            totalSites: websites.length,
            averageUptime,
            issues,
            websites: enriched
        }
    });
};

export const getWebsiteDetails = async (req: Request, res: Response) => {
    const user_id = req.user_id;
    const website_id = String(req.query.websiteId);
    const timeline = Number(req.query.timeline) || 50;

    if (!user_id || !website_id) {
        return res.status(400).json({ success: false });
    }

    // ownership check (IMPORTANT)
    const website = await prisma.website.findFirst({
        where: { id: website_id, user_id }
    });

    if (!website) {
        return res.status(404).json({ success: false });
    }

    const [avg_response, region_metrics, ticks] = await Promise.all([
        getAverageResponse(website_id),
        getRegionMetrics(website_id),
        getRecentTicks(website_id, timeline)
    ]);

    res.json({
        success: true,
        website_details: website,
        avg_response,
        region_metrics,
        ticks
    });
};

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
            success: true,
            message: "Successfully added the url!!",
            response
        })
    } catch (e: any) {
        return res.status(500).json({ message: e.message });
    }
}

export const deleteWebsite = async (req: Request, res: Response) => {
    try {
        const website_id = String(req.query.websiteId);
        const user_id = req.user_id;

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

        const deleted = await prisma.website.delete({
            where: {
                user_id,
                id: website_id
            }
        })

        if (deleted) {
            return res.status(200).json({
                success: true,
                message: "successfully deleted!!",
            });
        }

    } catch (e: any) {
        return res.status(500).json({ message: e.message });
    }
}