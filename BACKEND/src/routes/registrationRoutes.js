const express = require("express");
const router = express.Router();

const {
  joinEvent,
  leaveEvent,
} = require("../controllers/registrationController");

const auth = require("../middleware/authMiddleware");

// JOIN EVENT
router.post("/join/:id", auth, joinEvent);

// LEAVE EVENT
router.post("/leave/:id", auth, leaveEvent);

module.exports = router;