import mongoose from "mongoose";

const sosRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "acknowledged", "resolved"],
      default: "pending",
    },

    emergencyType: {
      type: String,
      enum: ["medical", "accident", "injury", "mental-health", "other"],
      default: "medical",
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    location: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
      address: {
        type: String,
        trim: true,
        default: "",
      },
    },

    acknowledgedAt: {
      type: Date,
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const SOSRequest = mongoose.model("SOSRequest", sosRequestSchema);

export default SOSRequest;
