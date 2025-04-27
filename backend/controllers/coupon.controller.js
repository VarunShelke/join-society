import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({
            userId: req.user._id,
            isActive: true,
        });
        res.json(coupon || null);
    } catch (error) {
        console.log("Error in getCoupon controller", error.message);
        res.status(500).json({message: "Server error", error: error.message});
    }
};

export const validateCoupon = async (req, res) => {
    try {
        const {code} = req.body;
        const coupon = await Coupon.findOne({
            code: code,
            isActive: true,
        });

        if (!coupon) {
            return res.status(404).json({message: "Coupon not found"});
        }

        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({message: "Coupon expired"});
        }

        res.json({
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
        });
    } catch (error) {
        console.log("Error in validateCoupon controller", error.message);
        res.status(500).json({message: "Server error", error: error.message});
    }
};

export const addCoupon = async (req, res) => {
    try {
        const {code, discount} = req.body;

        if (!code || !discount) {
            return res.status(400).json({message: "Coupon code and discount are required."});
        }

        const existingCoupon = await Coupon.findOne({
            code: code,
            isActive: true,
        })

        if (existingCoupon) {
            return res.status(400).json({message: "Coupon code already exists."});
        }

        const newCoupon = new Coupon({
            code: code,
            discountPercentage: discount,
            expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        })
        await newCoupon.save();
        return res.status(201).json({message: "Coupon created."});
    } catch (error) {
        console.log("Error in addCoupon controller", error.message);
        return res.status(500).json({message: "Server error", error: error.message});
    }
};
