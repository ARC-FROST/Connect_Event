const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadSelfie,
  findMyPhotos,
} = require("../controllers/faceController");

// REGISTER FACE
router.post(
  "/register",
  authMiddleware,
  upload.single("image"),
  uploadSelfie
);

// FIND PHOTOS
router.post(
  "/find",
  authMiddleware,
  upload.single("image"),
  findMyPhotos
);

module.exports = router;