const express = require("express");
const router = express.Router();

const {
  createComment,
  getCommentsByEvent,
  deleteComment,
} = require("../controllers/commentController");

const auth = require("../middleware/authMiddleware");

router.post("/:id", auth, createComment);
router.get("/:eventId", getCommentsByEvent);
router.delete("/:id", auth, deleteComment);

module.exports = router;