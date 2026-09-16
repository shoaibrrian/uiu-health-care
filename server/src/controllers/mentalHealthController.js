import MentalHealthResource from "../models/MentalHealthResource.js";

export const getAllResources = async (req, res) => {
  try {
    const resources = await MentalHealthResource.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error("Get resources error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while loading mental health resources.",
    });
  }
};

export const createResource = async (req, res) => {
  try {
    const { title, description, type, contact, link } = req.body;

    if (!title || !description || !type) {
      return res.status(400).json({
        success: false,
        message: "Title, description and type are required.",
      });
    }

    const resource = await MentalHealthResource.create({
      title: title.trim(),
      description: description.trim(),
      type,
      contact: contact?.trim() || "",
      link: link?.trim() || "",
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Resource created.",
      resource,
    });
  } catch (error) {
    console.error("Create resource error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating resource.",
    });
  }
};
