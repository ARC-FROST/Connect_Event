const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  toggleFavorite,
  getFavorites,
} = require("../controllers/favoriteController");

// toggle favorite
router.post("/:eventId", authMiddleware, toggleFavorite);

// get favorites
router.get("/", authMiddleware, getFavorites);

module.exports = router;