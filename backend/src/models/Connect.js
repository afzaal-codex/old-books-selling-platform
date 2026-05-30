import mongoose from "mongoose";

const connectSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email address",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Connect = mongoose.models.Connect || mongoose.model("Connect", connectSchema);

export default Connect;
