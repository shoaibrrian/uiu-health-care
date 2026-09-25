import User from "../models/User.js";
import SOSRequest from "../models/SOSRequest.js";
import Notification from "../models/Notification.js";

// =========================
// GET ALL SOS REQUESTS
// =========================

export const getAllSOS = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status ? { status } : {};

    const requests = await SOSRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate("student", "name email studentId program phone")
      .populate("resolvedBy", "name email");

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get all SOS error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while loading SOS requests.",
    });
  }
};

// =========================
// ACKNOWLEDGE SOS
// =========================

export const acknowledgeSOS = async (req, res) => {
  try {
    const sos = await SOSRequest.findById(req.params.id);

    if (!sos) {
      return res.status(404).json({
        success: false,
        message: "SOS request not found.",
      });
    }

    sos.status = "acknowledged";
    sos.acknowledgedAt = new Date();
    await sos.save();

    await Notification.create({
      student: sos.student,
      title: "SOS Acknowledged",
      message:
        "Your emergency request has been acknowledged by campus response team.",
      type: "sos",
      relatedSOS: sos._id,
    });

    const populated = await SOSRequest.findById(sos._id)
      .populate("student", "name email studentId program phone")
      .populate("resolvedBy", "name email");

    // Notify all admins + the specific student in real time
    const io = req.app.get("io");
    io.to("admins").emit("sos:updated", populated);
    io.to(`student-${sos.student}`).emit("sos:updated", populated);

    return res.status(200).json({
      success: true,
      message: "SOS acknowledged.",
      sos: populated,
    });
  } catch (error) {
    console.error("Acknowledge SOS error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while acknowledging SOS.",
    });
  }
};

// =========================
// RESOLVE SOS
// =========================

export const resolveSOS = async (req, res) => {
  try {
    const { resolutionNote } = req.body;

    const sos = await SOSRequest.findById(req.params.id);

    if (!sos) {
      return res.status(404).json({
        success: false,
        message: "SOS request not found.",
      });
    }

    sos.status = "resolved";
    sos.resolvedAt = new Date();
    sos.resolvedBy = req.user._id;
    if (resolutionNote) sos.resolutionNote = resolutionNote;
    await sos.save();

    await Notification.create({
      student: sos.student,
      title: "Emergency Resolved",
      message: resolutionNote || "Your emergency request has been resolved.",
      type: "sos",
      relatedSOS: sos._id,
    });

    const populated = await SOSRequest.findById(sos._id)
      .populate("student", "name email studentId program phone")
      .populate("resolvedBy", "name email");

    // Real-time push: student dashboard should instantly show "Solved"
    const io = req.app.get("io");
    io.to("admins").emit("sos:updated", populated);
    io.to(`student-${sos.student}`).emit("sos:resolved", populated);

    return res.status(200).json({
      success: true,
      message: "SOS marked as resolved.",
      sos: populated,
    });
  } catch (error) {
    console.error("Resolve SOS error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while resolving SOS.",
    });
  }
};

// =========================
// GET ALL STUDENTS
// =========================

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Get all students error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while loading students.",
    });
  }
};

// =========================
// DASHBOARD STATS
// =========================

export const getAdminStats = async (req, res) => {
  try {
    const [totalStudents, pending, acknowledged, resolved] = await Promise.all([
      User.countDocuments({ role: "student" }),
      SOSRequest.countDocuments({ status: "pending" }),
      SOSRequest.countDocuments({ status: "acknowledged" }),
      SOSRequest.countDocuments({ status: "resolved" }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        sos: {
          pending,
          acknowledged,
          resolved,
          total: pending + acknowledged + resolved,
        },
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while loading stats.",
    });
  }
};
