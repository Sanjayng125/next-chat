const dotenv = require("dotenv");
dotenv.config();

const io = require("socket.io")(process.env.SOCKET_PORT, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  // console.log("Socket Connected");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    if (!onlineUsers.some((user) => user.userId === userData._id)) {
      onlineUsers.push({ userId: userData._id, socketId: socket.id });
    }
    // console.log("User Connected: ", userData._id);
    io.emit("get-users", onlineUsers);
    socket.emit("connected");
  });

  socket.on("join-room", (chatId) => {
    socket.join(chatId);
    // console.log("User Joined Room: ", chatId);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("send-message", (message) => {
    // console.log("Message Sent: ", message);

    const users = message.users;

    if (users.length > 0) {
      users.forEach((user) => {
        if (user._id !== message.sender._id) {
          socket.in(user._id).emit("receive-message", message);
        }
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get-users", onlineUsers);
    // console.log("User Dissconnected", activeUsers);
  });
});
