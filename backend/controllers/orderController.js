import Order from "../model/Order.js";
import Product from "../model/Product.js";

// Create a new order
// controllers/orderController.js
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

// Get all orders for logged in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("orderItems.product","name images colors");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all orders", error: err.message });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to get order", error: err.message });
  }
};

export const getOrderStatusById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Map order status to step index (must match OrderSuccess `steps` array)
   const statusMap = {
  "Processing": 0,
  "Shipped": 1,
  "Arriving": 2,
  "Delivered": 3,
};

    const statusStep = statusMap[order.orderStatus] ?? 0;

    res.status(200).json({ statusStep });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order status", error: err.message });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;

    if (status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order", error: err.message });
  }
};

// Mark order as paid
export const markOrderPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isPaid = true;
    order.paidAt = Date.now();

    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update payment status", error: err.message });
  }
};
