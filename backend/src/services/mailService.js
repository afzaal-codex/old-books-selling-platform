import transporter from "../config/email.js";
import { getBrandedEmailTemplate } from "../utils/emailTemplate.js";

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"NBookr World" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  return await transporter.sendMail(mailOptions);
};

const sendBrandedEmail = async ({ to, subject, bodyHtml }) => {
  const brandedHtml = getBrandedEmailTemplate(bodyHtml, subject);
  return await sendEmail({ to, subject, html: brandedHtml });
};

export { sendEmail, sendBrandedEmail };
export default sendEmail;