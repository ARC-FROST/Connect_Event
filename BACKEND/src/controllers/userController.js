const User = require("../models/User");
const Event = require("../models/Event");
const Media = require("../models/Media");

exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
  .select("-password")
  .populate("followers", "name email")
  .populate("following", "name email");
  
    const events = await Event.find({
      createdBy: userId,
    });

    const uploads = await Media.find({
      uploadedBy: userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      user,
      eventCount: events.length,
      uploadCount: uploads.length,
      events,
      uploads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};