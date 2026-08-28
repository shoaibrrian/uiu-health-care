import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =========================
// HELPERS
// =========================

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

const isValidUIUStudentEmail = (email) => {
  // UIU student email format:
  // <name><last 6 digits of ID>@<program>.uiu.ac.bd
  //
  // Example:
  // kshifullah233024@bsds.uiu.ac.bd

  const emailRegex = /^[a-z][a-z0-9]*\d{6}@[a-z0-9]+\.uiu\.ac\.bd$/i;

  return emailRegex.test(email);
};

const isEmailStudentIdMatch = (email, studentId) => {
  const emailLocalPart = email.split("@")[0].toLowerCase();

  const normalizedStudentId = studentId.replace(/\D/g, "");

  if (normalizedStudentId.length < 6) {
    return false;
  }

  const lastSixDigits = normalizedStudentId.slice(-6);

  return emailLocalPart.endsWith(lastSixDigits);
};

const isEmailProgramMatch = (email, program) => {
  const [, domain] = email.split("@");

  if (!domain || !program) {
    return false;
  }

  const programCode = domain.split(".")[0].toLowerCase();

  return programCode === program.toLowerCase().trim();
};

// =========================
// REGISTER STUDENT
// =========================

export const register = async (req, res) => {
  try {
    const { name, email, password, studentId, program, phone } = req.body;

    // Required fields
    if (!name || !email || !password || !studentId || !program) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedStudentId = studentId.trim();
    const normalizedProgram = program.trim();

    // Prevent admin account creation through student registration
    if (normalizedEmail === "admin@uiu.ac.bd") {
      return res.status(403).json({
        success: false,
        message:
          "Admin accounts cannot be created through student registration.",
      });
    }

    // Validate UIU student email structure
    if (!isValidUIUStudentEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please use a valid UIU student email address.",
      });
    }

    // Validate Student ID
    const numericStudentId = normalizedStudentId.replace(/\D/g, "");

    if (numericStudentId.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid student ID.",
      });
    }

    // Email must contain the last 6 digits of Student ID
    if (!isEmailStudentIdMatch(normalizedEmail, normalizedStudentId)) {
      return res.status(400).json({
        success: false,
        message: "Student ID does not match the email address.",
      });
    }

    // Email program must match selected program code
    if (!isEmailProgramMatch(normalizedEmail, normalizedProgram)) {
      return res.status(400).json({
        success: false,
        message: "The selected program does not match your UIU email address.",
      });
    }

    // Check existing account
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { studentId: normalizedStudentId }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or Student ID is already registered.",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
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
      program: normalizedProgram,
      phone: phone?.trim() || "",
      role: "student",
      isVerified: false,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message:
        "Student account created successfully. Please verify your email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        program: user.program,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    // Handle duplicate MongoDB key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email or Student ID already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while creating account.",
    });
  }
};

// =========================
// LOGIN
// =========================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check account status
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated. Please contact the administrator.",
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId || null,
        program: user.program || null,
        phone: user.phone || null,
        profileImage: user.profileImage || null,
        isVerified: user.isVerified,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while logging in.",
    });
  }
};
