import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { autoSeedAdmin } from "./src/utils/adminSeeder.js";

import cron from "node-cron";

import User from "./src/models/User.js";

dotenv.config();

connectDB().then(() => {
  autoSeedAdmin();
});

// =========================================
// AUTO INACTIVE USER CHECK
// =========================================

cron.schedule(
  "0 0 * * *",
  async () => {
    try {

      console.log(
        "Checking inactive users..."
      );

      // 30 DAYS AGO
      const thirtyDaysAgo =
        new Date(
          Date.now() -
          30 * 24 * 60 * 60 * 1000
        );

      // UPDATE USERS
      const result =
        await User.updateMany(
          {
            lastActiveAt: {
              $lt: thirtyDaysAgo,
            },

            isInactive: false,
          },
          {
            $set: {
              isInactive: true,
            },
          }
        );

      console.log(
        `${result.modifiedCount} users marked inactive`
      );

    } catch (error) {

      console.log(
        "Inactive user cron error:",
        error.message
      );
    }
  }
);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});

// Server startup script