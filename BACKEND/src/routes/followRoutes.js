const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  toggleFollow,
  getMyFollowing,
} = require("../controllers/followController");

// FOLLOW / UNFOLLOW
router.post(
  "/:userId",
  authMiddleware,
  toggleFollow
);
// GET MY FOLLOWING LIST
router.get(
  "/my-following",
  authMiddleware,
  getMyFollowing
);

module.exports = router;