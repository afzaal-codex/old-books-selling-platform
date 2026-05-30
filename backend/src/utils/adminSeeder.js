import User from "../models/User.js";

/**
 * Automatically seeds or updates the admin user in MongoDB based on the current .env settings.
 */
export const autoSeedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "Muhammad Afzaal";

    if (!adminEmail || !adminPassword) {
      console.warn("ADMIN_EMAIL or ADMIN_PASSWORD not specified in .env. Skipping admin autoseeding.");
      return;
    }

    const emailLower = adminEmail.toLowerCase();
    let admin = await User.findOne({ email: emailLower });

    if (admin) {
      // Admin exists, check if password matches. If it doesn't, update the password to match .env
      const isMatch = await admin.matchPassword(adminPassword);
      if (!isMatch) {
        console.log(`Updating admin (${emailLower}) password to match the .env ADMIN_PASSWORD...`);
        admin.password = adminPassword;
        admin.name = adminName;
        admin.isVerified = true;
        admin.isBlocked = false;
        admin.isInactive = false;
        await admin.save();
        console.log("Admin password updated successfully in the database.");
      }
    } else {
      console.log(`Admin user (${emailLower}) not found in the database. Creating one now...`);
      await User.create({
        name: adminName,
        email: emailLower,
        password: adminPassword,
        phone: "1234567890",
        isVerified: true,
        isBlocked: false,
        isInactive: false,
        lastActiveAt: new Date()
      });
      console.log("Admin user seeded successfully in the database.");
    }
  } catch (error) {
    console.error("Failed to autoseed admin user:", error.message);
  }
};
