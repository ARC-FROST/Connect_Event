const Media = require("../models/Media");
const Event = require("../models/Event");
const Album = require("../models/Album");
const uploadToCloudinary = require("../services/cloudinaryService");
const aiService = require("../services/aiTagService");
const sharp = require("sharp");
const axios = require("axios");
const faceRecognitionService =require("../services/faceRecognitionService");

// UPLOAD MEDIA 
exports.uploadMedia = async (req, res) => {
  try {
    const { eventId, albumId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    let album = null;
    if (albumId) {
      album = await Album.findById(albumId);

      if (!album || album.event.toString() !== eventId) {
        return res.status(400).json({
          success: false,
          message: "Invalid album",
        });
      }
    }

    
    // CLOUDINARY UPLOAD
    const result = await uploadToCloudinary(
      req.file,
      "image"
    );

    console.log("Cloudinary URL:", result.secure_url);

   
    // AI TAGS 
    let tags = [];

    try {
      tags = await aiService.generateTags(
        result.secure_url
      );
    } catch (err) {
      console.log("AI tagging failed:", err.message);
    }
    
    // FACE DETECTION
    let faceTokens = [];

try {
  const faces =
    await faceRecognitionService.detectFaces(
      result.secure_url
    );

  console.log("Face API response:", faces);

  if (Array.isArray(faces)) {
    faceTokens = faces
      .map((f) => f.face_token)
      .filter(Boolean);
  } else {
    faceTokens = [];
  }

  console.log("Face tokens:", faceTokens);
} catch (err) {
  console.log("Face detection failed:", err.message);
}

    // SAVE MEDIA
    const media = await Media.create({
      eventId,
      album: albumId || null,
      uploadedBy: req.user.id,
      mediaUrl: result.secure_url,
      publicId: result.public_id,
      tags,
      faceTokens,
    });

    event.media.push(media._id);
    await event.save();

    if (album) {
      album.media.push(media._id);
      await album.save();
    }

    return res.status(201).json({
      success: true,
      media,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// GET EVENT MEDIA
exports.getEventMedia = async (req, res) => {
  try {
    const media = await Media.find({
      eventId: req.params.eventId,
    })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: media.length,
      media,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL MEDIA
exports.getAllMedia = async (req, res) => {
  try {
    const media = await Media.find()
      .populate("eventId", "title location")
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: media.length,
      media,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// SEARCH MEDIA (AI TAG BASED)
exports.searchMedia = async (req, res) => {
  try {
    const { query } = req.query;

    const media = await Media.find({
      $or: [
        { tags: query },
        { tags: { $in: [query] } },
        { mediaUrl: { $regex: query, $options: "i" } },
      ],
    })
      .populate("eventId")
      .populate("uploadedBy");

    res.status(200).json({
      success: true,
      count: media.length,
      media,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.downloadMedia = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    // Convert to forced download URL
    const downloadUrl = url.replace(
      "/upload/",
      "/upload/fl_attachment/"
    );

    return res.redirect(downloadUrl);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.downloadWatermarkedMedia = async (
  req,
  res
) => {
  try {
    const { mediaId } = req.params;

    const media = await Media.findById(mediaId)
      .populate({
        path: "eventId",
        populate: {
          path: "createdBy",
          select: "name",
        },
      });

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    const imageResponse = await axios.get(
      media.mediaUrl,
      {
        responseType: "arraybuffer",
      }
    );

    const eventName =
      media.eventId?.title || "Event";

    const organizerName =
      media.eventId?.createdBy?.name ||
      "Organizer";

    const metadata = await sharp(
  imageResponse.data
).metadata();

const width = metadata.width;
const height = metadata.height;

const svg = `
<svg width="${width}" height="${height}">
  <style>
    .watermark {
      fill: rgba(255,255,255,0.55);
      font-size: 28px;
      font-family: Arial;
    }
  </style>

  <text
    x="20"
    y="${height - 30}"
    class="watermark"
  >
    ${eventName} | ${organizerName}
  </text>
</svg>
`;

    const output = await sharp(
      imageResponse.data
    )
      .composite([
        {
          input: Buffer.from(svg),
          top: 0,
          left: 0,
        },
      ])
      .jpeg()
      .toBuffer();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=event-photo.jpg`
    );

    res.setHeader(
      "Content-Type",
      "image/jpeg"
    );

    res.send(output);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};