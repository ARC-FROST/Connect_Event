const express = require("express");
const router = express.Router();

const { toggleLike } = require("../controllers/likeController");

const auth = require("../middleware/authMiddleware");

// LIKE / UNLIKE EVENT
router.post("/:id", auth, toggleLike);

module.exports = router;