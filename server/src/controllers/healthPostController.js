import HealthPost from "../models/HealthPost.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await HealthPost.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name");

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while loading health posts.",
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required.",
      });
    }

    const post = await HealthPost.create({
      title: title.trim(),
      content: content.trim(),
      category: category || "general",
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Post published.",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating post.",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await HealthPost.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post deleted.",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting post.",
    });
  }
};
