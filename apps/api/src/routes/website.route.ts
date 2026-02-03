import { Router } from "express";
import { getWebsiteDetails, Website } from "../controllers/website.controller";

const router: Router = Router();

router.get("/status/:websiteId", getWebsiteDetails);
router.post("/website", Website);

export default router;