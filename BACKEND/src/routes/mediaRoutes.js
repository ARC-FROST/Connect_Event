const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadMedia,
  getEventMedia,
  getAllMedia,
  searchMedia,
  downloadMedia,
  downloadWatermarkedMedia,
} = require("../controllers/mediaController");

// PUBLIC
router.get("/", getAllMedia);
router.get("/search", searchMedia);
router.get("/event/:eventId", getEventMedia);

// DOWNLOAD ROUTE 👇
router.get("/download", downloadMedia);

router.get(
  "/download/:mediaId",
  downloadWatermarkedMedia
);

// UPLOAD
router.post(
  "/upload",
  authMiddleware,
  upload.single("media"),
  uploadMedia
);

module.exports = router;