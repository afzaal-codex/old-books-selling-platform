import Newsletter from "../models/Newsletter.js";
import Settings from "../models/Settings.js";
import Connect from "../models/Connect.js";
import { sendBrandedEmail } from "../services/mailService.js";

const subscribeNewsletter = async (req, res) => {
  const email = req.body.email?.toLowerCase().trim();
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const existing = await Newsletter.findOne({ email });
  if (existing) return res.status(400).json({ success: false, message: "Email is already subscribed" });

  await Newsletter.create({ email });

  // Send Welcome Email
  try {
    const settings = await Settings.findOne() || {};
    const subject = settings.emailTemplates?.newsletterWelcomeSubject || "Welcome to Our Newsletter!";
    const body = settings.emailTemplates?.newsletterWelcomeBody || "Thank you for subscribing! You are on our list, we will inform you about our rare books and updates.";
    
    await sendBrandedEmail({
      to: email,
      subject,
      bodyHtml: `<p>${body}</p>`
    });
  } catch (emailError) {
    console.error("Newsletter welcome email sending failed:", emailError.message);
  }

  res.status(201).json({ success: true, message: "Subscribed successfully" });
};

const getNewsletterSubscribers = async (req, res) => {
  const subscribers = await Newsletter.find().sort({ createdAt: -1 });
  res.json(subscribers);
};

const sendCustomEmail = async (req, res) => {
  try {
    const { target, subject, body } = req.body;
    if (!subject || !body) {
      return res.status(400).json({ success: false, message: "Subject and body are required" });
    }

    let emails = [];
    if (target === "newsletter" || target === "all") {
      const nl = await Newsletter.find().select("email");
      emails.push(...nl.map((x) => x.email));
    }
    if (target === "connect" || target === "all") {
      const conn = await Connect.find().select("email");
      emails.push(...conn.map((x) => x.email));
    }

    // Deduplicate
    const uniqueEmails = [...new Set(emails.map((e) => e.toLowerCase().trim()))];

    if (uniqueEmails.length === 0) {
      return res.status(400).json({ success: false, message: "No subscribers found for the selected target" });
    }

    // Send emails in parallel
    const sendPromises = uniqueEmails.map((email) =>
      sendBrandedEmail({
        to: email,
        subject,
        bodyHtml: body.replace(/\n/g, "<br/>"), // simple formatting of text lines
      }).catch((err) => console.error(`Failed to send email to ${email}:`, err.message))
    );

    await Promise.all(sendPromises);

    res.json({ success: true, message: `Email sent successfully to ${uniqueEmails.length} subscribers!` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { subscribeNewsletter, getNewsletterSubscribers, sendCustomEmail };
