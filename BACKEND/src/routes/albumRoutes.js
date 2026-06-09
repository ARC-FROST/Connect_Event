const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createAlbum,
  getEventAlbums,
  addMediaToAlbum,
} = require("../controllers/albumController");

// CREATE ALBUM
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "photographer"),
  createAlbum
);

// GET ALBUMS OF EVENT
router.get("/event/:eventId", getEventAlbums);

// ADD MEDIA TO ALBUM
router.post(
  "/add-media",
  authMiddleware,
  roleMiddleware("admin", "photographer"),
  addMediaToAlbum
);

module.exports = router;