import { Router } from "express";
import { getWebsiteDetails, Website } from "../controllers/website.controller";

const router: Router = Router();

router.get("/status/:wensiteId", getWebsiteDetails);
router.post("/website", Website);

export default router;