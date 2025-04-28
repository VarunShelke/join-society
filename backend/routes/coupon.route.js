import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {getCoupon, getCouponsByUser, validateCoupon, addCoupon} from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon);
router.post("/validate", protectRoute, validateCoupon);
router.post("/add", addCoupon);
router.get("/my", protectRoute, getCouponsByUser);

export default router;
