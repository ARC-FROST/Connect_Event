require("dotenv").config();
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });

const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://connect-event-eight.vercel.app",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-user", (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined user room ${userId}`);
  });

  socket.on("join-event", (eventId) => {
    socket.join(eventId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 2001;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});