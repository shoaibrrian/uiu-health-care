import mongoose from "mongoose";

const firstAidGuideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: ["low", "moderate", "critical"],
      default: "moderate",
    },
    steps: [
      {
        type: String,
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const FirstAidGuide = mongoose.model("FirstAidGuide", firstAidGuideSchema);

export default FirstAidGuide;
