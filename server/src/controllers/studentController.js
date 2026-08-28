import User from "../models/User.js";
import SOSRequest from "../models/SOSRequest.js";
import MedicalProfile from "../models/MedicalProfile.js";

// =========================
// GET STUDENT DASHBOARD
// =========================

export const getStudentDashboard = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student account not found.",
      });
    }

    const activeSOS = await SOSRequest.findOne({
      student: student._id,
      status: {
        $in: ["pending", "acknowledged"],
      },
    })
      .sort({ createdAt: -1 })
      .populate("resolvedBy", "name email");

    const recentSOS = await SOSRequest.find({
      student: student._id,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("resolvedBy", "name email");

    return res.status(200).json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        program: student.program,
        phone: student.phone,
        profileImage: student.profileImage,
        isVerified: student.isVerified,
      },
      sos: {
        active: activeSOS,
        recent: recentSOS,
      },
    });
  } catch (error) {
    console.error("Get student dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while loading dashboard.",
    });
  }
};

// =========================
// CREATE SOS REQUEST
// =========================

export const createSOS = async (req, res) => {
  try {
    const { emergencyType, message, latitude, longitude, address } = req.body;

    const student = await User.findById(req.user._id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student account not found.",
      });
    }

    // Prevent multiple unresolved SOS requests
    const existingSOS = await SOSRequest.findOne({
      student: student._id,
      status: {
        $in: ["pending", "acknowledged"],
      },
    });

    if (existingSOS) {
      return res.status(409).json({
        success: false,
        message: "You already have an active SOS request.",
        sos: existingSOS,
      });
    }

    const sos = await SOSRequest.create({
      student: student._id,
      emergencyType: emergencyType || "medical",
      message: message?.trim() || "",
      location: {
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        address: address?.trim() || "",
      },
      status: "pending",
    });

    const populatedSOS = await SOSRequest.findById(sos._id).populate(
      "student",
      "name email studentId program phone",
    );

    return res.status(201).json({
      success: true,
      message:
        "Emergency SOS sent successfully. Campus administration has been notified.",
      sos: populatedSOS,
    });
  } catch (error) {
    console.error("Create SOS error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while sending SOS.",
    });
  }
};

// =========================
// GET STUDENT SOS HISTORY
// =========================

export const getSOSHistory = async (req, res) => {
  try {
    const requests = await SOSRequest.find({
      student: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("resolvedBy", "name email");

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get SOS history error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while loading SOS history.",
    });
  }
};

// =========================
// GET MEDICAL PROFILE
// =========================

export const getMedicalProfile = async (req, res) => {
  try {
    const medicalProfile = await MedicalProfile.findOne({
      student: req.user._id,
    });

    // Profile doesn't exist yet
    if (!medicalProfile) {
      return res.status(200).json({
        success: true,
        exists: false,
        medicalProfile: null,
      });
    }

    return res.status(200).json({
      success: true,
      exists: true,
      medicalProfile,
    });
  } catch (error) {
    console.error("Get medical profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while loading medical profile.",
    });
  }
};

// =========================
// CREATE / UPDATE MEDICAL PROFILE
// =========================

export const saveMedicalProfile = async (req, res) => {
  try {
    const {
      bloodGroup,
      allergies,
      medicalConditions,
      currentMedications,
      emergencyContact,
      additionalNotes,
    } = req.body;

    const medicalProfile = await MedicalProfile.findOneAndUpdate(
      {
        student: req.user._id,
      },
      {
        student: req.user._id,
        bloodGroup: bloodGroup || "",
        allergies: Array.isArray(allergies) ? allergies : [],
        medicalConditions: Array.isArray(medicalConditions)
          ? medicalConditions
          : [],
        currentMedications: Array.isArray(currentMedications)
          ? currentMedications
          : [],
        emergencyContact: {
          name: emergencyContact?.name?.trim() || "",
          relationship: emergencyContact?.relationship?.trim() || "",
          phone: emergencyContact?.phone?.trim() || "",
        },
        additionalNotes: additionalNotes?.trim() || "",
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Medical profile saved successfully.",
      medicalProfile,
    });
  } catch (error) {
    console.error("Save medical profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while saving medical profile.",
    });
  }
};

// =========================
// DELETE MEDICAL PROFILE
// =========================

export const deleteMedicalProfile = async (req, res) => {
  try {
    const medicalProfile = await MedicalProfile.findOneAndDelete({
      student: req.user._id,
    });

    if (!medicalProfile) {
      return res.status(404).json({
        success: false,
        message: "Medical profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medical profile deleted successfully.",
    });
  } catch (error) {
    console.error("Delete medical profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting medical profile.",
    });
  }
};
