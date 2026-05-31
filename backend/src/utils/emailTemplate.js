export const getBrandedEmailTemplate = (contentHtml, title = "Book World", supportEmail = "hello@bookworld.site") => {
  const clientUrl = (process.env.CLIENT_URL || "https://www.bookworld.site").replace(/\/$/, "");
  const logoUrl = `${clientUrl}/Company%20Logo/BookWorldLogo.png`;

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #d4af37; background-color: #000000; color: #ffffff; border-radius: 12px; box-sizing: border-box; text-align: left; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.15);">
      <div style="text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 24px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 12px auto; text-align: center;">
          <tr>
            <td align="center">
              <img src="${logoUrl}" alt="Book World Logo" width="56" height="56" style="display: block; width: 56px; height: 56px; border-radius: 50%; border: 2px solid #d4af37; background-color: #111111; object-fit: cover;" />
            </td>
          </tr>
        </table>
        <h1 style="color: #d4af37; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase;">Book World</h1>
        <p style="color: #a0a0a0; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em;">Your Premium Old Books Destination</p>
      </div>
      
      <div style="font-size: 14px; line-height: 1.6; color: #e0e0e0; margin-bottom: 24px;">
        ${contentHtml}
      </div>
      
      <div style="border-top: 1px solid #222222; padding-top: 20px; margin-top: 30px; font-size: 11px; color: #777777; text-align: center;">
        <p style="margin: 0 0 6px 0;">This email is sent securely by <strong>Book World</strong>.</p>
        <p style="margin: 0 0 6px 0;">Support Email: <a href="mailto:${supportEmail}" style="color: #d4af37; text-decoration: none;">${supportEmail}</a></p>
        <p style="margin: 0 0 12px 0;">&copy; ${new Date().getFullYear()} Book World. All rights reserved.</p>
        <p style="margin: 0; font-size: 10px; color: #444444;">Please do not reply directly to this automated notification.</p>
      </div>
    </div>
  `;
};
