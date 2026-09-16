import FirstAidGuide from "../models/FirstAidGuide.js";

// =========================
// GET ALL GUIDES (student + admin)
// =========================

export const getAllGuides = async (req, res) => {
  try {
    const guides = await FirstAidGuide.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: guides.length,
      guides,
    });
  } catch (error) {
    console.error("Get guides error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while loading first aid guides.",
    });
  }
};

// =========================
// CREATE GUIDE (admin only)
// =========================

export const createGuide = async (req, res) => {
  try {
    const { title, category, severity, steps } = req.body;

    if (
      !title ||
      !category ||
      !steps ||
      !Array.isArray(steps) ||
      steps.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, category and at least one step are required.",
      });
    }

    const guide = await FirstAidGuide.create({
      title: title.trim(),
      category: category.trim(),
      severity: severity || "moderate",
      steps,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "First aid guide created.",
      guide,
    });
  } catch (error) {
    console.error("Create guide error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating guide.",
    });
  }
};

// =========================
// DELETE GUIDE (admin only)
// =========================

export const deleteGuide = async (req, res) => {
  try {
    const guide = await FirstAidGuide.findByIdAndDelete(req.params.id);

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Guide deleted.",
    });
  } catch (error) {
    console.error("Delete guide error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting guide.",
    });
  }
};
