import { Router } from "express";
import { getWebsiteDetails, Website, getDashboardDetails, deleteWebsite } from "../controllers/website.controller";

const router: Router = Router();

router.get("/website", getDashboardDetails);
router.get("/status", getWebsiteDetails);
router.post("/website", Website);
router.delete("/website", deleteWebsite);

export default router;