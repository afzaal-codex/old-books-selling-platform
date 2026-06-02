import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // =========================================
    // BASIC USER INFO
    // =========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    // =========================================
    // USER STATUS
    // =========================================

    isVerified: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    // =========================================
    // USER ACTIVITY STATUS
    // =========================================

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },

    isInactive: {
      type: Boolean,
      default: false,
    },

    // =========================================
    // GOOGLE AUTH
    // =========================================

    googleId: {
      type: String,
      default: "",
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    // =========================================
    // PASSWORD RESET
    // =========================================

    resetPasswordToken: {
      type: String,
      default: "",
    },

    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// =========================================
// HASH PASSWORD BEFORE SAVE
// =========================================

userSchema.pre(
  "save",
  async function (next) {

    // SKIP IF PASSWORD NOT MODIFIED
    if (
      !this.isModified("password")
    ) {
      return next();
    }

    // GENERATE SALT
    const salt =
      await bcrypt.genSalt(10);

    // HASH PASSWORD
    this.password =
      await bcrypt.hash(
        this.password,
        salt
      );

    next();
  }
);

// =========================================
// MATCH PASSWORD
// =========================================

userSchema.methods.matchPassword =
  async function (
    enteredPassword
  ) {
    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

// =========================================
// USER MODEL
// =========================================

const User = mongoose.models.User || mongoose.model(
  "User",
  userSchema
);

export default User;