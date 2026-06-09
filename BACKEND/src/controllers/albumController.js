const Album = require("../models/Album");
const Event = require("../models/Event");

// CREATE ALBUM
exports.createAlbum = async (req, res) => {
  try {
    const { title, description, eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const album = await Album.create({
      title,
      description,
      event: eventId,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      album,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL ALBUMS OF EVENT
exports.getEventAlbums = async (req, res) => {
  try {
    const albums = await Album.find({ event: req.params.eventId })
      .populate("media")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      albums,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ADD MEDIA TO ALBUM
exports.addMediaToAlbum = async (req, res) => {
  try {
    const { albumId, mediaId } = req.body;

    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    album.media.push(mediaId);
    await album.save();

    res.status(200).json({
      success: true,
      message: "Media added to album",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};