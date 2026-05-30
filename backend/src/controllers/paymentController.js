import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import Notification from "../models/Notification.js";

const createPayment = async (req, res) => {
  try {
    const { orderId, transactionId, paymentMethod, screenshot } = req.body;

    if (!orderId || !transactionId || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const payment = await Payment.create({
      order: orderId,
      transactionId,
      paymentMethod,
      screenshot,
      verificationStatus: "Pending",
    });

    // Update order status to Pending Payment Verification
    order.orderStatus = "Pending Payment Verification";
    await order.save();

    // Notify user
    await Notification.create({
      user: order.user,
      title: "Payment Details Submitted",
      message: `Your payment details for order ${order._id} (TXID: ${transactionId}) have been submitted and are under verification.`,
      type: "payment"
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "order",
        populate: { path: "user", select: "name email phone" }
      })
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("order");

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    const { verificationStatus, adminNotes } = req.body;

    payment.verificationStatus = verificationStatus;
    if (adminNotes) {
      payment.adminNotes = adminNotes;
    }

    await payment.save();

    // Update the linked Order
    const order = await Order.findById(payment.order._id);
    if (order) {
      if (verificationStatus === "Approved") {
        order.paymentStatus = "Paid";
        order.orderStatus = "Approved"; // Transition to next stage
      } else if (verificationStatus === "Rejected") {
        order.paymentStatus = "Failed";
        order.orderStatus = "Payment Rejected";
      }
      await order.save();

      // Notify User
      await Notification.create({
        user: order.user,
        title: `Payment ${verificationStatus}`,
        message: `Your payment verification for order ${order._id} has been ${verificationStatus.toLowerCase()}. Notes: ${adminNotes || "None"}`,
        type: "payment"
      });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createPayment,
  getPayments,
  verifyPayment,
};