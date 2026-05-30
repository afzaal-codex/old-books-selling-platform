import Connect from "../models/Connect.js";
import Settings from "../models/Settings.js";
import { sendBrandedEmail } from "../services/mailService.js";

export const subscribeEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Check if already exists
    const existing = await Connect.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This email is already connected with us!",
      });
    }

    await Connect.create({ email });

    // Send Welcome Email
    try {
      const settings = await Settings.findOne() || {};
      const subject = settings.emailTemplates?.connectWelcomeSubject || "Thank you for connecting with us!";
      const body = settings.emailTemplates?.connectWelcomeBody || "You are on our list, we will inform you. We'll be in touch shortly!";
      
      await sendBrandedEmail({
        to: email.toLowerCase().trim(),
        subject,
        bodyHtml: `<p>${body}</p>`
      });
    } catch (emailError) {
      console.error("Connect welcome email sending failed:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Thank you for connecting with us! We will keep you updated.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getConnectSubscribers = async (req, res) => {
  try {
    const subscribers = await Connect.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
