import mongoose from "mongoose";

const mentalHealthResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["article", "helpline", "exercise", "counselor"],
      required: true,
    },
    contact: {
      type: String,
      trim: true,
      default: "",
    },
    link: {
      type: String,
      trim: true,
      default: "",
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

const MentalHealthResource = mongoose.model(
  "MentalHealthResource",
  mentalHealthResourceSchema,
);

export default MentalHealthResource;
