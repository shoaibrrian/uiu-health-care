import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["sos", "system", "health-tip"],
      default: "system",
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedSOS: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SOSRequest",
    },
  },
  {
    timestamps: true,
  },
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
