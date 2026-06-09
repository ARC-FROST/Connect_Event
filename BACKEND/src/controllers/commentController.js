const Event = require("../models/Event");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const User = require("../models/User");

exports.createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    // SAVE COMMENT
    const comment = await Comment.create({
      text,
      user: userId,
      event: eventId,
    });
   
// TAGGED USERS
const tagMatches = text.match(/@(\w+)/g) || [];

    // ADD TO EVENT
    event.comments.push(comment._id);
    await event.save();

   
    // NOTIFICATION (DB)
    if (event.createdBy.toString() !== userId) {
      await Notification.create({
        user: event.createdBy,
        type: "comment",
        message: "Someone commented on your event",
        event: eventId,
      });
    }

    // SOCKET.IO LIVE UPDATE

    const io = req.app.get("io");


// TAG FRIENDS
for (const tag of tagMatches) {
  const username = tag.replace("@", "");

  const taggedUser = await User.findOne({
    name: {
      $regex: new RegExp(`^${username}$`, "i"),
    },
  });

  if (!taggedUser) continue;

  if (taggedUser._id.toString() === userId) continue;

  await Notification.create({
    user: taggedUser._id,
    type: "tag",
    message: `${req.user.name} tagged you in a comment`,
    event: eventId,
  });

  io.to(taggedUser._id.toString()).emit(
    "notification",
    {
      type: "tag",
      message: `${req.user.name} tagged you in a comment`,
      eventId,
      from: userId,
    }
  );
}

    const populatedComment = await comment.populate("user", "name email");

    //  Send to event owner
    if (event.createdBy.toString() !== userId) {
      io.to(event.createdBy.toString()).emit("notification", {
        type: "comment",
        message: "Someone commented on your event",
        eventId,
        from: userId,
      });
    }

    //  Broadcast live comment 
    io.to(eventId).emit("new-comment", {
      comment: populatedComment,
      eventId,
    });

    res.status(201).json({
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET COMMENTS OF AN EVENT
exports.getCommentsByEvent = async (req, res) => {
  try {
    const comments = await Comment.find({
      event: req.params.eventId,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE COMMENT
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};