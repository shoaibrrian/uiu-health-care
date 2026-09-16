import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import FirstAidGuide from "../models/FirstAidGuide.js";
import User from "../models/User.js";

dotenv.config();

const guides = [
  {
    title: "Choking",
    category: "Airway Emergency",
    severity: "critical",
    steps: [
      "Ask the person if they can speak or cough — if yes, encourage coughing.",
      "If they cannot breathe, speak, or cough, stand behind them and lean them forward.",
      "Give 5 sharp back blows between the shoulder blades with the heel of your hand.",
      "If that fails, perform 5 abdominal thrusts (Heimlich maneuver).",
      "Alternate back blows and abdominal thrusts until the object is expelled or help arrives.",
      "Call emergency services immediately if the person becomes unconscious.",
    ],
  },
  {
    title: "Minor Burns",
    category: "Skin Injury",
    severity: "low",
    steps: [
      "Cool the burn under cool (not cold) running water for 10-20 minutes.",
      "Remove any tight clothing or jewelry near the burn before swelling starts.",
      "Cover loosely with a sterile, non-stick bandage.",
      "Do not apply ice, butter, or ointments directly to the burn.",
      "Take a pain reliever if needed.",
      "Seek medical attention if the burn is larger than 3 inches or on the face/hands.",
    ],
  },
  {
    title: "Fainting",
    category: "Loss of Consciousness",
    severity: "moderate",
    steps: [
      "Lay the person flat on their back and elevate their legs about 12 inches.",
      "Loosen any tight clothing around the neck.",
      "Check for breathing and pulse.",
      "If they don't regain consciousness within a minute, call emergency services.",
      "Once conscious, keep them lying down for a few minutes before sitting up slowly.",
      "If fainting happens repeatedly, seek medical evaluation.",
    ],
  },
  {
    title: "Severe Bleeding",
    category: "Wound Care",
    severity: "critical",
    steps: [
      "Apply firm, direct pressure to the wound with a clean cloth or bandage.",
      "Keep applying pressure without lifting the cloth to check.",
      "If blood soaks through, add more layers rather than removing the first.",
      "Elevate the injured area above heart level if possible.",
      "Call emergency services immediately for heavy or spurting blood.",
      "Watch for signs of shock: pale skin, rapid breathing, confusion.",
    ],
  },
  {
    title: "Seizures",
    category: "Neurological Emergency",
    severity: "critical",
    steps: [
      "Stay calm and clear the area of sharp or hard objects.",
      "Do not restrain the person or put anything in their mouth.",
      "Cushion their head with something soft.",
      "Turn them onto their side once shaking stops to keep the airway clear.",
      "Time the seizure — call emergency services if it lasts more than 5 minutes.",
      "Stay with them until they are fully alert.",
    ],
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

  await FirstAidGuide.deleteMany({});

  const withAuthor = guides.map((g) => ({ ...g, createdBy: admin._id }));
  await FirstAidGuide.insertMany(withAuthor);

  console.log(`${guides.length} first aid guides seeded successfully!`);

  await mongoose.disconnect();
};

run();
