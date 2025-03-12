import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Địa chỉ front-end hoặc mobile app
      methods: ["GET", "POST"]
    },
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);

    // Người dùng tham gia vào phòng tin nhắn (chat)**
    socket.on("joinChat", (chatId) => {
      socket.join(`chat-${chatId}`);
      console.log(`User ${socket.id} joined chat room chat-${chatId}`);
    });

    // Người dùng gửi tin nhắn**
    socket.on("sendMessage", ({ chatId, message }) => {
      const room = `chat-${chatId.toString()}`;
      console.log(`Broadcasting newMessage to ${room}:`, message);
      io.to(room).emit("newMessage", message); // Thống nhất tên sự kiện
    });
    

    // Người dùng rời khỏi phòng tin nhắn**
    socket.on("leaveChat", (chatId) => {
      socket.leave(`chat-${chatId}`);
      console.log(`User ${socket.id} left chat room chat-${chatId}`);
    });

    // Người dùng tham gia vào phòng bài viết**
    socket.on("joinPost", (postId) => {
      socket.join(`post-${postId}`);
      console.log(`User ${socket.id} joined post room post-${postId}`);
    });

    // Người dùng bình luận hoặc cập nhật bài viết**
    socket.on("updatePost", ({ postId, update }) => {
      io.to(`post-${postId}`).emit("postUpdated", update);
    });

    // Người dùng rời khỏi phòng bài viết**
    socket.on("leavePost", (postId) => {
      socket.leave(`post-${postId}`);
      console.log(`User ${socket.id} left post room post-${postId}`);
    });

    // Khi người dùng ngắt kết nối**
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
};

// **Hàm phát sự kiện từ server đến client**
export const emitEvent = (roomType, id, event, data) => {
  if (io) {
    const room = `${roomType}-${id.toString()}`; // Chắc chắn ID là string
    io.to(room).emit(event, data);
  } else {
    console.error("Socket.io is not initialized");
  }
};

