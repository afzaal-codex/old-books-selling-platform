import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please add a valid email address"],
    },
  },
  { timestamps: true }
);

const Newsletter = mongoose.models.Newsletter || mongoose.model("Newsletter", newsletterSchema);

export default Newsletter;
