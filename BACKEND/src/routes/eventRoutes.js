const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents  
} = require("../controllers/eventController");

// PUBLIC ROUTES
router.get("/my", authMiddleware, getMyEvents);
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// PROTECTED ROUTES

// Create Event
router.post(
  "/",
  authMiddleware,
  createEvent
);

// Update Event
router.put(
  "/:id",
  authMiddleware,
  updateEvent
);

// Delete Event
router.delete(
  "/:id",
  authMiddleware,
  deleteEvent
);

module.exports = router;