import User from "../models/User.js";

/**
 * Automatically seeds or updates the admin user in MongoDB based on the current .env settings.
 */
export const autoSeedAdmin = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || "").trim();
    const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();
    const adminName = (process.env.ADMIN_NAME || "Muhammad Afzaal").trim();

    if (!adminEmail || !adminPassword) {
      console.warn("ADMIN_EMAIL or ADMIN_PASSWORD not specified in env. Skipping admin autoseeding.");
      return;
    }

    const emailLower = adminEmail.toLowerCase();
    
    // First check if there is an admin already in the database
    let admin = await User.findOne({ isAdmin: true });

    if (admin) {
      console.log(`Admin user already exists in database: ${admin.email}. Seeding skipped.`);
      return;
    }

    // Otherwise, check if a user with process.env.ADMIN_EMAIL exists and make them the admin
    admin = await User.findOne({ email: emailLower });

    if (admin) {
      console.log(`Setting existing user (${emailLower}) as admin...`);
      admin.isAdmin = true;
      admin.isVerified = true;
      admin.isBlocked = false;
      admin.isInactive = false;
      await admin.save();
    } else {
      console.log(`Admin user (${emailLower}) not found in the database. Creating one now...`);
      await User.create({
        name: adminName,
        email: emailLower,
        password: adminPassword,
        phone: "1234567890",
        isAdmin: true,
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
