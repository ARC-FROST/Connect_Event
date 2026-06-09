const User = require("../models/User");
const Media = require("../models/Media");
const uploadToCloudinary = require("../services/cloudinaryService");
const faceService = require("../services/facePlusPlusService");


// 1. REGISTER USER FACE
exports.uploadSelfie = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No selfie uploaded",
      });
    }

    const result = await uploadToCloudinary(req.file, "image");

    const faces = await faceService.detectFaces(result.secure_url);

    if (!faces || faces.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No face detected",
      });
    }

    const faceToken = faces[0].face_token;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.referenceSelfie = result.secure_url;
    user.faceToken = faceToken;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Face registered successfully",
      selfie: result.secure_url,
      faceToken,
    });
  } catch (error) {
    console.log("Upload Selfie Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 2. FIND MY PHOTOS
exports.findMyPhotos = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Selfie required",
      });
    }

    const selfie = await uploadToCloudinary(req.file, "image");

    const allMedia = await Media.find()
      .populate("eventId", "title location date")
      .populate("uploadedBy", "name email");

    const matched = [];

    for (let m of allMedia) {
      const score = await faceService.compareFaces(
        selfie.secure_url,
        m.mediaUrl
      );

      if (score > 75) {
        matched.push(m);
      }
    }

    return res.status(200).json({
      success: true,
      count: matched.length,
      media: matched,
    });
  } catch (error) {
    console.log("Face search error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};