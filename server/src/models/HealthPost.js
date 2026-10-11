import mongoose from "mongoose";

const healthPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "nutrition",
        "fitness",
        "hygiene",
        "seasonal",
        "campaign",
        "general",
      ],
      default: "general",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const HealthPost = mongoose.model("HealthPost", healthPostSchema);

export default HealthPost;
