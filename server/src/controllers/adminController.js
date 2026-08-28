import bcrypt from "bcryptjs";
import SOSRequest from "../models/SOSRequest.js";
import User from "../models/User.js";

// =========================
// GET ALL SOS REQUESTS
// =========================

export const getAllSOS = async (req, res) => {
  try {
    const sosRequests = await SOSRequest.find()
      .populate("student", "name email studentId program phone profileImage")
      .populate("resolvedBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: sosRequests.length,
      sos: sosRequests,
    });
  } catch (error) {
    console.error("Get all SOS error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching SOS requests.",
    });
  }
};

// =========================
// GET PENDING SOS REQUESTS
// =========================

export const getPendingSOS = async (req, res) => {
  try {
    const sosRequests = await SOSRequest.find({
      status: "pending",
    })
      .populate("student", "name email studentId program phone profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: sosRequests.length,
      sos: sosRequests,
    });
  } catch (error) {
    console.error("Get pending SOS error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching pending SOS requests.",
    });
  }
};

// =========================
// GET SINGLE SOS
// =========================

export const getSOSById = async (req, res) => {
  try {
    const { id } = req.params;

    const sos = await SOSRequest.findById(id)
      .populate("student", "name email studentId program phone profileImage")
      .populate("resolvedBy", "name email role");

    if (!sos) {
      return res.status(404).json({
        success: false,
        message: "SOS request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      sos,
    });
  } catch (error) {
    console.error("Get SOS by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching SOS request.",
    });
  }
};

// =========================
// ACKNOWLEDGE SOS
// =========================

export const acknowledgeSOS = async (req, res) => {
  try {
    const { id } = req.params;

    const sos = await SOSRequest.findById(id);

    if (!sos) {
      return res.status(404).json({
        success: false,
        message: "SOS request not found.",
      });
    }

    if (sos.status === "resolved") {
      return res.status(400).json({
        success: false,
        message: "This SOS request has already been resolved.",
      });
    }

    if (sos.status === "acknowledged") {
      return res.status(400).json({
        success: false,
        message: "This SOS request has already been acknowledged.",
      });
    }

    sos.status = "acknowledged";
    sos.acknowledgedAt = new Date();

    await sos.save();

    const updatedSOS = await SOSRequest.findById(sos._id).populate(
      "student",
      "name email studentId program phone profileImage",
    );

    return res.status(200).json({
      success: true,
      message: "SOS request acknowledged successfully.",
      sos: updatedSOS,
    });
  } catch (error) {
    console.error("Acknowledge SOS error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while acknowledging SOS request.",
    });
  }
};

// =========================
// RESOLVE SOS
// =========================

export const resolveSOS = async (req, res) => {
  try {
    const { id } = req.params;

    const sos = await SOSRequest.findById(id);

    if (!sos) {
      return res.status(404).json({
        success: false,
        message: "SOS request not found.",
      });
    }

    if (sos.status === "resolved") {
      return res.status(400).json({
        success: false,
        message: "This SOS request has already been resolved.",
      });
    }

    // Only acknowledged SOS can be resolved
    if (sos.status !== "acknowledged") {
      return res.status(400).json({
        success: false,
        message: "SOS request must be acknowledged before it can be resolved.",
      });
    }

    sos.status = "resolved";
    sos.resolvedAt = new Date();
    sos.resolvedBy = req.user._id;

    await sos.save();

    const updatedSOS = await SOSRequest.findById(sos._id)
      .populate("student", "name email studentId program phone profileImage")
      .populate("resolvedBy", "name email role");

    return res.status(200).json({
      success: true,
      message: "SOS request resolved successfully.",
      sos: updatedSOS,
    });
  } catch (error) {
    console.error("Resolve SOS error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while resolving SOS request.",
    });
  }
};

// =========================
// CREATE ADMIN ACCOUNT
// =========================

export const createAdmin = async (req, res) => {
  try {
    const { name, password, phone } = req.body;

    const adminEmail = "admin@uiu.ac.bd";

    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: "Name and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin account already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name: name.trim(),
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      program: "Administration",
      phone: phone?.trim() || "",
      isVerified: true,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully.",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating admin account.",
    });
  }
};
