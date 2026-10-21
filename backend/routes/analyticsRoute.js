import express from "express";
import { getDashboardAnalytics, askAICopilot } from "../controllers/analyticsController.js";
import adminAuth from "../middleware/adminAuth.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/dashboard", adminAuth, getDashboardAnalytics);
analyticsRouter.post("/ask-ai", adminAuth, askAICopilot);

export default analyticsRouter;
