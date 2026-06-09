const Attendee = require("../models/Attendee");
const uploadToCloudinary = require("../services/cloudinaryService");

exports.registerAttendee = async (req, res) => {
  try {
    const { eventId, name, email } = req.body;

    let selfieUrl = "";
    let selfiePublicId = "";

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "event-management/selfies",
        "image"
      );

      selfieUrl = result.secure_url;
      selfiePublicId = result.public_id;
    }

    const attendee = await Attendee.create({
      eventId,
      name,
      email,
      selfieUrl,
      selfiePublicId,
    });

    res.status(201).json({
      success: true,
      attendee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEventAttendees = async (req, res) => {
  try {
    const attendees = await Attendee.find({
      eventId: req.params.eventId,
    });

    res.status(200).json({
      success: true,
      count: attendees.length,
      attendees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};