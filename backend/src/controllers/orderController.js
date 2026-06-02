import Order from "../models/Order.js";
import Book from "../models/Book.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import sendEmail from "../services/mailService.js";
import { getBrandedEmailTemplate } from "../utils/emailTemplate.js";
import Settings from "../models/Settings.js";
import Payment from "../models/Payment.js";

const createOrder = async (req, res) => {
  try {
    const { 
      orderItems, 
      shippingAddress, 
      paymentMethod, 
      deliveryCharges, 
      subtotal, 
      totalPrice, 
      couponDiscount,
      transactionId,
      paymentScreenshot
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    // Check stock availability
    for (const item of orderItems) {
      const book = await Book.findById(item.book);
      if (!book) {
        return res.status(404).json({ success: false, message: `Book not found: ${item.title}` });
      }
      if (book.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${book.title}` });
      }
    }

    // Generate unique order number ORD-YYYY-XXXXXX
    let orderNumber;
    let unique = false;
    const year = new Date().getFullYear();
    let count = await Order.countDocuments({
      createdAt: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31T23:59:59.999Z`),
      },
    });

    while (!unique) {
      count++;
      orderNumber = `ORD-${year}-${count.toString().padStart(6, "0")}`;
      const existing = await Order.findOne({ orderNumber });
      if (!existing) {
        unique = true;
      }
    }

    const orderStatus = paymentMethod === "COD" ? "Approved" : "Pending Payment Verification";

    const order = await Order.create({
      user: req.user ? req.user._id : undefined,
      orderItems,
      shippingAddress,
      paymentMethod,
      deliveryCharges,
      subtotal,
      totalPrice,
      couponDiscount,
      orderNumber,
      transactionId: transactionId || "",
      paymentScreenshot: paymentScreenshot || "",
      orderStatus,
      paymentStatus: "Pending",
      timeline: [
        {
          status: orderStatus,
          notes: paymentMethod === "COD" ? "Order approved (Cash on Delivery)" : "Order placed, pending payment verification",
          actionDate: new Date(),
          actionBy: req.user ? req.user.name : "Guest",
        }
      ]
    });

    // Deduct stock
    for (const item of orderItems) {
      await Book.findByIdAndUpdate(item.book, {
        $inc: { stock: -item.quantity },
      });
    }

    // Create Notification if logged in
    if (req.user) {
      await Notification.create({
        user: req.user._id,
        title: "Order Placed Successfully",
        message: `Your order ${orderNumber} of Rs. ${totalPrice} has been placed. Payment method: ${paymentMethod}.`,
        type: "order"
      });
    }

    // Create global admin notification for new order
    await Notification.create({
      title: "New Order Received",
      message: `Order ${orderNumber} of Rs. ${totalPrice} has been placed by ${shippingAddress?.fullName || "Guest"}. Phone: ${shippingAddress?.phone || "N/A"}. Method: ${paymentMethod}.`,
      type: "order"
    });

    // Send tracking email to guest/customer
    try {
      const recipientEmail = shippingAddress?.email;
      if (recipientEmail) {
        const trackingUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/track/${order._id}`;
        const settings = await Settings.findOne() || {};
        
        const confirmationSubject = settings.emailTemplates?.orderConfirmationSubject || "Order Confirmed - {orderNumber}";
        const confirmationBody = settings.emailTemplates?.orderConfirmationBody || "Thank you for shopping with us! Your order has been received and is being processed.";
        
        const customerName = shippingAddress?.fullName || "Customer";
        const subjectText = confirmationSubject.replace(/{orderNumber}/g, orderNumber);
        const bodyText = confirmationBody
          .replace(/{orderNumber}/g, orderNumber)
          .replace(/{customerName}/g, customerName);
        
        const orderContent = `
          <h2 style="color: #d4af37; font-size: 20px; margin-top: 0;">${subjectText}</h2>
          <p>${bodyText}</p>
          
          <div style="background-color: #111111; padding: 15px; border-radius: 8px; border: 1px solid #222222; margin: 20px 0;">
            <h3 style="color: #d4af37; margin-top: 0; font-size: 16px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; color: #ffffff;">
              <thead>
                <tr style="border-bottom: 1px solid #d4af37; text-align: left;">
                  <th style="padding: 8px 0; font-size: 13px;">Book</th>
                  <th style="padding: 8px 0; text-align: center; font-size: 13px;">Qty</th>
                  <th style="padding: 8px 0; text-align: right; font-size: 13px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${orderItems.map(item => `
                  <tr style="border-bottom: 1px solid #222222;">
                    <td style="padding: 8px 0; font-size: 12px;">${item.title}</td>
                    <td style="padding: 8px 0; text-align: center; font-size: 12px;">${item.quantity}</td>
                    <td style="padding: 8px 0; text-align: right; font-size: 12px;">Rs. ${item.price}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
            
            <div style="margin-top: 15px; text-align: right; font-size: 13px;">
              <p style="margin: 5px 0;">Subtotal: Rs. ${subtotal}</p>
              <p style="margin: 5px 0;">Discount: Rs. ${couponDiscount}</p>
              <p style="margin: 5px 0;">Delivery: Rs. ${deliveryCharges}</p>
              <p style="margin: 5px 0; color: #d4af37; font-weight: bold; font-size: 16px;">Total: Rs. ${totalPrice}</p>
            </div>
          </div>
          
          <div style="margin: 25px 0; text-align: center;">
            <p style="margin-bottom: 15px;">You can track your order status in real-time by clicking the button below:</p>
            <a href="${trackingUrl}" style="background-color: #d4af37; color: #000000; padding: 12px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; border: 1px solid #d4af37; display: inline-block;">Track Your Order</a>
          </div>
          
          <p style="font-size: 12px; color: #888888; text-align: center; margin-top: 20px;">If you have any questions, please contact support at hello@bookworld.site.</p>
        `;

        await sendEmail({
          to: recipientEmail,
          subject: subjectText,
          html: getBrandedEmailTemplate(orderContent, subjectText, settings.supportEmail || "hello@bookworld.site")
        });
      }
    } catch (emailErr) {
      console.error("Order confirmation email failed to send:", emailErr.message);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.book")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.book")
      .populate("assignedEmployee", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Access control: only block if the order belongs to a user and requester is neither owner nor admin
    if (order.user) {
      if (!req.user || (req.user._id.toString() !== order.user._id.toString() && !req.user.isAdmin)) {
        return res.status(403).json({ success: false, message: "Not authorized to view this order" });
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status, paymentMethod, city, customer, range, orderNumber, transactionId } = req.query;
    const query = {};

    if (status) {
      query.orderStatus = status;
    }
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }
    if (city) {
      query["shippingAddress.city"] = { $regex: city, $options: "i" };
    }
    if (orderNumber) {
      query.orderNumber = { $regex: orderNumber, $options: "i" };
    }
    if (transactionId) {
      query.transactionId = { $regex: transactionId, $options: "i" };
    }
    if (customer) {
      query.$or = [
        { "shippingAddress.fullName": { $regex: customer, $options: "i" } },
        { "shippingAddress.email": { $regex: customer, $options: "i" } },
        { "shippingAddress.phone": { $regex: customer, $options: "i" } }
      ];
    }

    if (range && range !== "all") {
      const now = new Date();
      let startDate = null;
      if (range === "7d") startDate = new Date(now.setDate(now.getDate() - 7));
      else if (range === "30d" || range === "1m") startDate = new Date(now.setMonth(now.getMonth() - 1));
      else if (range === "6m") startDate = new Date(now.setMonth(now.getMonth() - 6));
      else if (range === "1y") startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      
      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("assignedEmployee", "name email")
      .populate({
        path: "orderItems.book",
        populate: {
          path: "category author"
        }
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const { 
      orderStatus, 
      paymentStatus, 
      assignedEmployee, 
      processingNotes, 
      deliveryNotes, 
      approvalNotes, 
      internalNotes 
    } = req.body;

    let timelineNotes = [];

    if (orderStatus && orderStatus !== order.orderStatus) {
      timelineNotes.push(`Status changed from ${order.orderStatus} to ${orderStatus}`);
      order.orderStatus = orderStatus;

      if (orderStatus === "Delivered" && order.paymentMethod === "COD" && order.paymentStatus !== "Paid") {
        order.paymentStatus = "Paid";
        timelineNotes.push(`Payment status auto-updated to Paid for COD Delivery`);
        const payment = await Payment.findOne({ order: order._id });
        if (payment) {
          payment.verificationStatus = "Approved";
          await payment.save();
        } else {
          await Payment.create({
            order: order._id,
            transactionId: `COD-${order.orderNumber}`,
            paymentMethod: "COD",
            verificationStatus: "Approved"
          });
        }
      }
    }

    if (paymentStatus && paymentStatus !== order.paymentStatus) {
      timelineNotes.push(`Payment status changed from ${order.paymentStatus} to ${paymentStatus}`);
      order.paymentStatus = paymentStatus;

      const payment = await Payment.findOne({ order: order._id });
      let verificationStatus = "Pending";
      if (paymentStatus === "Paid") verificationStatus = "Approved";
      else if (paymentStatus === "Failed") verificationStatus = "Rejected";

      if (payment) {
        payment.verificationStatus = verificationStatus;
        await payment.save();
      } else {
        await Payment.create({
          order: order._id,
          transactionId: order.transactionId || `AUTO-${order.orderNumber}`,
          paymentMethod: order.paymentMethod || "Bank Transfer",
          verificationStatus
        });
      }
    }

    if (assignedEmployee !== undefined && assignedEmployee !== String(order.assignedEmployee || "")) {
      let empName = "None";
      if (assignedEmployee) {
        const emp = await User.findById(assignedEmployee);
        if (emp) empName = emp.name;
        order.assignedEmployee = assignedEmployee;
      } else {
        order.assignedEmployee = undefined;
      }
      timelineNotes.push(`Assigned employee updated to: ${empName}`);
    }

    if (processingNotes !== undefined && processingNotes !== order.processingNotes) {
      order.processingNotes = processingNotes;
      timelineNotes.push("Updated processing notes");
    }

    if (deliveryNotes !== undefined && deliveryNotes !== order.deliveryNotes) {
      order.deliveryNotes = deliveryNotes;
      timelineNotes.push("Updated delivery notes");
    }

    if (approvalNotes !== undefined && approvalNotes !== order.approvalNotes) {
      order.approvalNotes = approvalNotes;
      timelineNotes.push("Updated approval notes");
    }

    if (internalNotes !== undefined && internalNotes !== order.internalNotes) {
      order.internalNotes = internalNotes;
      timelineNotes.push("Updated internal notes");
    }

    if (timelineNotes.length > 0) {
      order.timeline.push({
        status: order.orderStatus,
        notes: timelineNotes.join(", "),
        actionDate: new Date(),
        actionBy: req.user ? req.user.name : "System",
      });
    }

    const updatedOrder = await order.save();

    // Notify user in system notifications
    if (order.user) {
      await Notification.create({
        user: order.user,
        title: `Order Status: ${order.orderStatus}`,
        message: `Your order status has been updated to ${order.orderStatus}.`,
        type: "order"
      });
    }

    // Send email notification on status update
    try {
      const recipientEmail = order.shippingAddress?.email;
      if (recipientEmail) {
        const trackingUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/track/${order._id}`;
        const settings = await Settings.findOne() || {};
        
        const isFailed = order.paymentStatus === "Failed" || order.orderStatus === "Payment Failed" || order.orderStatus === "Payment Failed/Declined";
        const customerName = order.shippingAddress.fullName || "Customer";
        
        let subjectText = "";
        let bodyText = "";
        
        if (isFailed) {
          const failureSubject = settings.emailTemplates?.paymentFailureSubject || "Payment Failed - Order {orderNumber}";
          const failureBody = settings.emailTemplates?.paymentFailureBody || "We were unable to verify your payment for order {orderNumber}. Please check details, try again, or contact support.";
          
          subjectText = failureSubject.replace(/{orderNumber}/g, order.orderNumber);
          bodyText = failureBody
            .replace(/{orderNumber}/g, order.orderNumber)
            .replace(/{customerName}/g, customerName);
        } else if (order.orderStatus === "Delivered") {
          const feedbackSubject = settings.emailTemplates?.feedbackSubject || "We'd love your feedback! - Order {orderNumber}";
          const feedbackBody = settings.emailTemplates?.feedbackBody || "How did you like your books and our service? Please share a review on the store!";
          
          subjectText = feedbackSubject.replace(/{orderNumber}/g, order.orderNumber);
          bodyText = feedbackBody
            .replace(/{orderNumber}/g, order.orderNumber)
            .replace(/{customerName}/g, customerName);
        } else {
          const updateSubject = settings.emailTemplates?.orderUpdateSubject || "Order Update - {orderNumber} is now {orderStatus}";
          const updateBody = settings.emailTemplates?.orderUpdateBody || "We wanted to let you know that the status of your order {orderNumber} has been updated to {orderStatus}.";
          
          subjectText = updateSubject
            .replace(/{orderNumber}/g, order.orderNumber)
            .replace(/{orderStatus}/g, order.orderStatus);
          bodyText = updateBody
            .replace(/{orderNumber}/g, order.orderNumber)
            .replace(/{orderStatus}/g, order.orderStatus)
            .replace(/{customerName}/g, customerName);
        }

        const emailContent = `
          <h2 style="color: #d4af37; font-size: 20px; margin-top: 0;">${subjectText}</h2>
          <p>${bodyText}</p>
          
          <div style="background-color: #111111; padding: 15px; border-radius: 8px; border: 1px solid #222222; margin: 20px 0;">
            <p style="margin: 5px 0; font-size: 13px;"><strong>Order Status:</strong> <span style="color: #d4af37; font-weight: bold;">${order.orderStatus}</span></p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Payment Status:</strong> <span style="color: #d4af37; font-weight: bold;">${order.paymentStatus}</span></p>
            ${processingNotes ? `<p style="margin: 10px 0 5px 0; font-size: 12px;"><strong>Status Details:</strong> ${processingNotes}</p>` : ""}
            ${deliveryNotes ? `<p style="margin: 5px 0; font-size: 12px;"><strong>Delivery/Tracking Information:</strong> ${deliveryNotes}</p>` : ""}
          </div>
          
          <div style="margin: 25px 0; text-align: center;">
            <p style="margin-bottom: 15px;">You can track your order status in real-time by clicking the button below:</p>
            <a href="${trackingUrl}" style="background-color: #d4af37; color: #000000; padding: 12px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; border: 1px solid #d4af37; display: inline-block;">Track Your Order</a>
          </div>
          
          <p style="font-size: 12px; color: #888888; text-align: center; margin-top: 20px;">If you have any questions, please contact support at hello@bookworld.site.</p>
        `;

        await sendEmail({
          to: recipientEmail,
          subject: subjectText,
          html: getBrandedEmailTemplate(emailContent, subjectText, settings.supportEmail || "hello@bookworld.site")
        });
      }
    } catch (emailErr) {
      console.error("Order status update email failed to send:", emailErr.message);
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Check if user is the owner
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this order" });
    }

    // Check if cancellation is allowed (only allowed if orderStatus is Pending Payment Verification or Approved/Pending)
    if (order.orderStatus === "Shipped" || order.orderStatus === "Out for Delivery" || order.orderStatus === "Delivered") {
      return res.status(400).json({ success: false, message: "Cannot cancel order. It has already been shipped or delivered." });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    // Restock books
    for (const item of order.orderItems) {
      await Book.findByIdAndUpdate(item.book, {
        $inc: { stock: item.quantity },
      });
    }

    // Create notification
    await Notification.create({
      user: order.user,
      title: "Order Cancelled",
      message: `Your order has been cancelled successfully, and items have been returned to stock.`,
      type: "order"
    });

    res.status(200).json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminDashboardStats = async (req, res) => {
  try {
    const orders = await Order.find();
    const booksCount = await Book.countDocuments();

    let totalRevenue = 0;
    let pendingVerification = 0;
    let deliveredOrders = 0;
    let cancelledOrders = 0;
    let codOrders = 0;
    let onlineOrders = 0;

    orders.forEach((order) => {
      if (order.orderStatus !== "Cancelled") {
        totalRevenue += order.totalPrice;
      }
      if (order.orderStatus === "Pending Payment Verification") {
        pendingVerification++;
      }
      if (order.orderStatus === "Delivered") {
        deliveredOrders++;
      }
      if (order.orderStatus === "Cancelled") {
        cancelledOrders++;
      }
      if (order.paymentMethod === "COD") {
        codOrders++;
      } else {
        onlineOrders++;
      }
    });

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        pendingVerification,
        deliveredOrders,
        cancelledOrders,
        codOrders,
        onlineOrders,
        booksCount,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const incrementDownloadCount = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    order.downloadCount = (order.downloadCount || 0) + 1;
    await order.save();
    res.json({ success: true, downloadCount: order.downloadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSixMonthReport = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const orders = await Order.find({ createdAt: { $gte: sixMonthsAgo } })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    let csv = "Order Number,Date,Customer Name,Email,Phone,City,Address,Payment Method,Payment Status,Order Status,Items,Subtotal,Delivery Charges,Discount,Total Price,Transaction ID\n";
    
    orders.forEach(order => {
      const itemsStr = order.orderItems.map(item => `${item.title} (x${item.quantity})`).join(" | ").replace(/"/g, '""');
      const row = [
        order.orderNumber || "",
        order.createdAt ? order.createdAt.toISOString() : "",
        order.shippingAddress?.fullName || order.user?.name || "Guest",
        order.shippingAddress?.email || order.user?.email || "",
        order.shippingAddress?.phone || "",
        order.shippingAddress?.city || "",
        `"${(order.shippingAddress?.address || "").replace(/"/g, '""')}"`,
        order.paymentMethod || "",
        order.paymentStatus || "",
        order.orderStatus || "",
        `"${itemsStr}"`,
        order.subtotal || 0,
        order.deliveryCharges || 0,
        order.couponDiscount || 0,
        order.totalPrice || 0,
        order.transactionId || ""
      ];
      csv += row.join(",") + "\n";
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders-report-6months.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getAdminDashboardStats,
  incrementDownloadCount,
  getSixMonthReport,
};