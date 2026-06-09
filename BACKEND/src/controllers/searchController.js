const Event = require("../models/Event");
const Media = require("../models/Media");
const User = require("../models/User");

// SEARCH EVENTS
exports.searchEvents = async (req, res) => {
  try {
    const { query } = req.query;

    const events = await Event.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    })
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// SEARCH MEDIA
exports.searchMedia = async (req, res) => {
  try {
    const { query } = req.query;

    const media = await Media.find({
      $or: [
        { tags: query },
        { tags: { $in: [query] } },
      ],
    })
      .populate("eventId", "title")
      .populate("uploadedBy", "name email");

    res.status(200).json({
      success: true,
      count: media.length,
      media,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// SEARCH PERSON
exports.searchPerson = async (req, res) => {
  try {
    const { query } = req.query;

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GLOBAL SEARCH
exports.globalSearch = async (req, res) => {
  try {
    const {
      query,
      page = 1,
      limit = 10,
      startDate,
      endDate,
    } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    
    // FIND MATCHING USERS
    const users = await User.find({
      $or: [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          email: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    }).select("-password");

    const userIds = users.map((user) => user._id);

    // EVENT FILTER
    let eventFilter = {
      $or: [
        {
          title: {
            $regex: query,
            $options: "i",
          },
        },
        {
          description: {
            $regex: query,
            $options: "i",
          },
        },
        {
          location: {
            $regex: query,
            $options: "i",
          },
        },
        {
          category: {
            $regex: query,
            $options: "i",
          },
        },
        {
          createdBy: {
            $in: userIds,
          },
        },
      ],
    };

    
    // DATE FILTER
    if (startDate || endDate) {
      eventFilter.date = {};

      if (startDate) {
        eventFilter.date.$gte = new Date(startDate);
      }

      if (endDate) {
        eventFilter.date.$lte = new Date(endDate);
      }
    }

    // SEARCH EVENTS
    const events = await Event.find(eventFilter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // SEARCH MEDIA 
    const media = await Media.find({
      tags: {
        $elemMatch: {
          $regex: query,
          $options: "i",
        },
      },
    })
      .populate("eventId", "title location date")
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

   
    // RESPONSE
    res.status(200).json({
      success: true,
      query,

      pagination: {
        page: Number(page),
        limit: Number(limit),
      },

      counts: {
        users: users.length,
        events: events.length,
        media: media.length,
      },

      users,
      events,
      media,
    });
  } catch (error) {
    console.error("GLOBAL SEARCH ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};