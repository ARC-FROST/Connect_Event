const User = require("../models/User");

exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.eventId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isFavorite = user.favorites.some(
      (id) => id.toString() === eventId
    );

    let updatedUser;

    if (isFavorite) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $pull: {
            favorites: eventId,
          },
        },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            favorites: eventId,
          },
        },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      favorites: updatedUser.favorites,
    });
  } catch (error) {
    console.error("FAVORITE ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("favorites");

    res.status(200).json({
      success: true,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("GET FAVORITES ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};