import { sendMailWithRetry } from "../config/email.js";
import { getBrandedEmailTemplate } from "../utils/emailTemplate.js";
import Settings from "../models/Settings.js";

/**
 * Send a raw HTML email using the retry-capable sender.
 * @param {{ to: string, subject: string, html: string }} options
 */
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Book World" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  return await sendMailWithRetry(mailOptions);
};

/**
 * Send a branded (templated) email using the retry-capable sender.
 * @param {{ to: string, subject: string, bodyHtml: string }} options
 */
const sendBrandedEmail = async ({ to, subject, bodyHtml }) => {
  let supportEmail = "hello@bookworld.site";
  try {
    const settings = await Settings.findOne();
    if (settings && settings.supportEmail) {
      supportEmail = settings.supportEmail;
    }
  } catch (err) {
    console.error("Failed to query supportEmail from CMS Settings:", err.message);
  }

  const brandedHtml = getBrandedEmailTemplate(bodyHtml, subject, supportEmail);
  return await sendEmail({ to, subject, html: brandedHtml });
};

export { sendEmail, sendBrandedEmail };
export default sendEmail;