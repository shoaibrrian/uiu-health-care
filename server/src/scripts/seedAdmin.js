import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const run = async () => {
  const email = process.env.ADMIN_EMAIL;
  const plainPassword = process.env.ADMIN_PASSWORD;

  if (!email || !plainPassword) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env first.");
    process.exit(1);
  }

  await connectDB();

  const hashedPassword = await bcrypt.hash(plainPassword, 12);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.password = hashedPassword;
    existing.role = "admin";
    existing.isActive = true;
    await existing.save();
    console.log("Admin password updated.");
  } else {
    await User.create({
      name: "System Admin",
      email,
      password: hashedPassword,
      role: "admin",
      program: "administration",
      isVerified: true,
      isActive: true,
    });
    console.log("Admin created.");
  }

  await mongoose.disconnect();
};

run();
