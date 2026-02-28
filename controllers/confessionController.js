import Confession from "../models/Confession.js";

/* ================= CREATE CONFESSION ================= */
export const createConfession = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        message: "Text is required",
      });
    }

    const confession = await Confession.create({
      text,
      user: req.user._id,
      image: req.file ? req.file.filename : null,
    });

    const populated = await Confession.findById(confession._id)
      .populate("user", "username");

    res.status(201).json(populated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL CONFESSIONS ================= */
export const getConfessions = async (req, res) => {
  try {
    const search = req.query.search
      ? { text: { $regex: req.query.search, $options: "i" } }
      : {};

    const confessions = await Confession.find(search)
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(confessions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET USER CONFESSIONS ================= */
export const getUserConfessions = async (req, res) => {
  try {
    const confessions = await Confession.find({
      user: req.params.id,
    })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(confessions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= LIKE ================= */
export const likeConfession = async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    const alreadyLiked = confession.likes.includes(req.user._id);

    if (alreadyLiked) {
      confession.likes.pull(req.user._id);
    } else {
      confession.likes.push(req.user._id);
    }

    await confession.save();

    res.json({ likes: confession.likes.length });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE ================= */
export const deleteConfession = async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    if (confession.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await confession.deleteOne();

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= EDIT ================= */
export const updateConfession = async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    if (confession.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    confession.text = req.body.text || confession.text;

    await confession.save();

    res.json(confession);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};