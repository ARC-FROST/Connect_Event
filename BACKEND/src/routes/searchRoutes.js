const express = require("express");
const router = express.Router();

const {
  searchEvents,
  searchMedia,
  searchPerson,
  globalSearch,
} = require("../controllers/searchController");

router.get("/", globalSearch);

router.get("/events", searchEvents);
router.get("/media", searchMedia);
router.get("/person", searchPerson);

module.exports = router;