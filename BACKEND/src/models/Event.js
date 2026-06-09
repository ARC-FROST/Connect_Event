const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      enum: ["tech", "music", "sports", "education", "social", "other"],
    },

    date: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    coverImage: {
      type: String,
      default: "",
    },

    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
      },
    ],

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],
attendees: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],
comments: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);