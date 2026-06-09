const Event = require("../models/Event");
const Notification = require("../models/Notification");

// LIKE / UNLIKE EVENT 
exports.toggleLike = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const alreadyLiked = event.likes.includes(userId);

    
    // LIKE / UNLIKE LOGIC
    if (alreadyLiked) {
      event.likes = event.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      event.likes.push(userId);
    }

    await event.save();
    
// REAL-TIME LIKE UPDATE
  const io = req.app.get("io");
io.to(eventId).emit("like-updated", {
  eventId,
  totalLikes: event.likes.length,
  liked: !alreadyLiked,
});

    // DATABASE NOTIFICATION
    if (!alreadyLiked && event.createdBy.toString() !== userId) {
      await Notification.create({
        user: event.createdBy,
        type: "like",
        message: "Someone liked your event",
        event: eventId,
      });
    }
    // SOCKET.IO REAL-TIME PUSH
    console.log("APP:", req.app);
  
    console.log("IO:", io);
    if (!alreadyLiked && event.createdBy.toString() !== userId) {
        console.log("Sending notification to:", event.createdBy.toString());
console.log("Liked by:", userId);
      io.to(event.createdBy.toString()).emit("notification", {
        type: "like",
        message: "Someone liked your event",
        eventId,
        from: userId,
      });
    }
    // RESPONSE
    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      totalLikes: event.likes.length,
    });
  } catch (error) {
  console.error("LIKE ERROR:");
  console.error(error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};