const Event = require("../models/Event");

// JOIN EVENT
exports.joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const alreadyJoined = event.attendees.includes(req.user.id);

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: "Already joined this event",
      });
    }

    event.attendees.push(req.user.id);
    await event.save();

    res.status(200).json({
      success: true,
      message: "Joined event successfully",
      totalAttendees: event.attendees.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LEAVE EVENT
exports.leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const isJoined = event.attendees.includes(req.user.id);

    if (!isJoined) {
      return res.status(400).json({
        success: false,
        message: "You are not part of this event",
      });
    }

    event.attendees = event.attendees.filter(
      (id) => id.toString() !== req.user.id
    );

    await event.save();

    res.status(200).json({
      success: true,
      message: "Left event successfully",
      totalAttendees: event.attendees.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};