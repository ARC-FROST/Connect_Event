const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
  type: String,
  enum: ["admin", "photographer", "member", "viewer"],
  default: "viewer",
},

    avatar: {
      type: String,
      default: "",
    },
    favorites: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
],
followers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

following: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

referenceSelfie: {
  type: String,
  default: "",
},

faceToken: {
  type: String,
  default: "",
},
  },
  {
    timestamps: true,
  }
  
);

module.exports = mongoose.model("User", userSchema);