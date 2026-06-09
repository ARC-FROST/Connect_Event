const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mediaUrl: {
      type: String,
      required: true,
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },

    tags: [
      {
        type: String,
      },
    ],

    caption: {
      type: String,
      default: "",
    },

    detectedPersons: [
      {
        type: String,
      },
    ],
    faceTokens: [
  {
    type: String,
  },
],

    aiTags: [
      {
        type: String,
      },
    ],

    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      default: null,
    },
    
  },
  { timestamps: true }
);

// Text search
mediaSchema.index({
  caption: "text",
  tags: "text",
  aiTags: "text",
});

// Performance indexes
mediaSchema.index({ eventId: 1, createdAt: -1 });
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ detectedPersons: 1 });

module.exports = mongoose.model("Media", mediaSchema);