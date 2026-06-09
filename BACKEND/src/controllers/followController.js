const User = require("../models/User");
const Notification = require("../models/Notification");

exports.toggleFollow = async (req, res) => {
  try {
    const userId = req.user.id;
    const targetUserId = req.params.userId;

    if (!userId || !targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or targetUserId",
      });
    }

    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isFollowing = currentUser.following
      .map(id => id.toString())
      .includes(targetUserId);

    if (isFollowing) {
      // UNFOLLOW
      await User.findByIdAndUpdate(userId, {
        $pull: { following: targetUserId },
      });

      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: userId },
      });
    } else {
      // FOLLOW
      await User.findByIdAndUpdate(userId, {
        $addToSet: { following: targetUserId },
      });

      await User.findByIdAndUpdate(targetUserId, {
        $addToSet: { followers: userId },
      });

      const currentUser = await User.findById(userId);

      // Notification
      await Notification.create({
        user: targetUserId,
        type: "follow",
        message: `${currentUser.name} started following you`,
      });

      const io = req.app.get("io");

      io.to(targetUserId).emit("notification", {
        type: "follow",
        message: `${currentUser.name} started following you`,
        from: userId,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Follow updated",
    });

  } catch (error) {
    console.error("FOLLOW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getMyFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "following",
      "_id"
    );

    const followingIds = user.following.map((u) =>
      u._id.toString()
    );

    res.json({
      success: true,
      followingIds,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};