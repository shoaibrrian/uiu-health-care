import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, studentId, program, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password || !studentId || !program) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, student ID and program are required.",
      });
    }

    // Validate UIU email
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail.endsWith(".uiu.ac.bd")) {
      return res.status(400).json({
        success: false,
        message: "Please use a valid UIU student email address.",
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // Check existing email
    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Check existing student ID
    const normalizedStudentId = studentId.trim();

    const existingStudent = await User.findOne({
      studentId: normalizedStudentId,
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "This student ID is already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create student account
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      studentId: normalizedStudentId,
      program: program.trim(),
      phone: phone?.trim() || "",
      role: "student",
      isVerified: false,
      isActive: true,
    });

    // Response
    return res.status(201).json({
      success: true,
      message:
        "Student account created successfully. Please verify your UIU email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        program: user.program,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this information already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the account.",
    });
  }
};
