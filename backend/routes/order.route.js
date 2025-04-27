import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getOrdersByUser } from "../controllers/order.controller.js";

const router = express.Router();
router.get("/", protectRoute, getOrdersByUser);
export default router;
