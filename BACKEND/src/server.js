require("dotenv").config();
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const connectDB = require("./config/db"); 

connectDB();

const server = http.createServer(app);

// SOCKET.IO INIT
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-user", (userId) => {
  socket.join(userId);

  console.log(
    `Socket ${socket.id} joined user room ${userId}`
  );
});

  socket.on("join-event", (eventId) => {
    socket.join(eventId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// START SERVER
const PORT = process.env.PORT || 2001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});