import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const run = async () => {
  await connectDB();

  const email = "admin@uiu.ac.bd";
  const plainPassword = "Admin@12345";

  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  const existing = await User.findOne({ email });

  if (existing) {
    existing.password = hashedPassword;
    existing.role = "admin";
    existing.isActive = true;
    await existing.save();
    console.log("Admin password reset successfully!");
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
    console.log("Admin created successfully!");
  }

  console.log("Email:", email);
  console.log(
    "Admin credentials set. Check your script file for the password, then delete/secure this file.",
  );

  await mongoose.disconnect();
};

run();
