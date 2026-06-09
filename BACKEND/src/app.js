const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const attendeeRoutes = require("./routes/attendeeRoutes");
const searchRoutes = require("./routes/searchRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const albumRoutes = require("./routes/albumRoutes");
const userRoutes = require("./routes/userRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const followRoutes = require("./routes/followRoutes");
const faceRoutes =require("./routes/faceRoutes");


const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://connect-event-eight.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/attendees", attendeeRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/faces", faceRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Event Management Backend Running",
  });
});

module.exports = app;