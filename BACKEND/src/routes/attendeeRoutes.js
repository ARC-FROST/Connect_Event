const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  registerAttendee,
  getEventAttendees,
} = require("../controllers/attendeeController");

router.post(
  "/register",
  upload.single("selfie"),
  registerAttendee
);

router.get(
  "/event/:eventId",
  getEventAttendees
);

module.exports = router;