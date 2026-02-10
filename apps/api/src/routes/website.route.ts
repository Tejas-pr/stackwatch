import { Router } from "express";
import { getWebsiteDetails, Website, getDashboardDetails } from "../controllers/website.controller";

const router: Router = Router();

router.get("/website", getDashboardDetails);
router.get("/status/:websiteId", getWebsiteDetails);
router.post("/website", Website);

export default router;