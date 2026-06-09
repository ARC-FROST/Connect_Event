const Event = require("../models/Event");

// CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      visibility,
      coverImage,
      media,
      location,
      status,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      date,
      visibility,
      coverImage,
      location,
      media: media || [],
      status: status || "upcoming",
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL EVENTS 

exports.getAllEvents = async (req, res) => {
  try {
    const userId = req.user?.id; 

    let filter = {};

    // If user is NOT logged in 
    if (!userId) {
      filter.visibility = "public";
    } else {
      // logged-in users 
      filter = {
        $or: [
          { visibility: "public" },
          { createdBy: userId },
        ],
      };
    }

    const events = await Event.find(filter)
  .populate(
  "createdBy",
  "name email role followers"
)
  .populate("media")
  .populate("comments")
  .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// GET SINGLE EVENT
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("media");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const userId = req.user?.id;

    // PRIVATE EVENT CHECK
    if (
      event.visibility === "private" &&
      event.createdBy.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied: private event",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE EVENT
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Ownership check
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this event",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "date",
      "visibility",
      "coverImage",
      "location",
      "status"
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )
      .populate("createdBy", "name email role")
      .populate("media");

    res.status(200).json({
      success: true,
      event: updatedEvent,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE EVENT (secure)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Ownership check
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this event",
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      createdBy: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};