import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import MentalHealthResource from "../models/MentalHealthResource.js";
import User from "../models/User.js";

dotenv.config();

const resources = [
  {
    title: "National Mental Health Helpline",
    description:
      "24/7 confidential support line for anyone experiencing emotional distress or a mental health crisis.",
    type: "helpline",
    contact: "09611677777",
  },
  {
    title: "Kaan Pete Roi",
    description:
      "Bangladesh's first emotional support helpline, run by trained volunteers, for anyone feeling overwhelmed, anxious, or in crisis.",
    type: "helpline",
    contact: "09606-999-999",
  },
  {
    title: "5-Minute Breathing Exercise",
    description:
      "A simple guided breathing technique to reduce anxiety before exams, presentations, or stressful moments.",
    type: "exercise",
  },
  {
    title: "Understanding Exam Stress",
    description:
      "An article on recognizing academic burnout early and practical steps to manage workload without sacrificing wellbeing.",
    type: "article",
  },
  {
    title: "UIU Counseling Services",
    description:
      "Confidential one-on-one sessions with a licensed counselor, available to all currently enrolled students.",
    type: "counselor",
    contact: "counseling@uiu.ac.bd",
  },
  {
    title: "Grounding Technique (5-4-3-2-1)",
    description:
      "A sensory grounding exercise to help manage panic attacks and overwhelming anxiety in the moment.",
    type: "exercise",
  },
];

const run = async () => {
  await connectDB();

  const admin = await User.findOne({ role: "admin" });

  if (!admin) {
    console.log("No admin found. Run seedAdmin.js first.");
    await mongoose.disconnect();
    return;
  }

  await MentalHealthResource.deleteMany({});

  const withAuthor = resources.map((r) => ({ ...r, createdBy: admin._id }));
  await MentalHealthResource.insertMany(withAuthor);

  console.log(
    `${resources.length} mental health resources seeded successfully!`,
  );

  await mongoose.disconnect();
};

run();
