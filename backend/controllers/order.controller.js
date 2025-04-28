import Order from "../models/order.model.js";

export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("products.product", "name imageUrl");
    res.json(orders);
  } catch (err) {
    console.error("Error in getOrdersByUser", err);
    res.status(500).json({ message: "Server error" });
  }
};
