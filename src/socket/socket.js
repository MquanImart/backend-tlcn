// initSocket.js
import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:3001', // Địa chỉ front-end
      credentials: true, // Cho phép gửi cookie qua CORS nếu cần
    },
  });

  io.on('connection', (socket) => {
    // Khi người dùng tham gia bài kiểm tra, cho họ vào phòng tương ứng
    socket.on('joinQuiz', (quizId) => {
      socket.join(`online-quiz-${quizId}`);
      console.log(`User ${socket.id} joined room online-quiz-${quizId}`);
    });

    // Khi người dùng rời phòng
    socket.on('leaveQuiz', (quizId) => {
      socket.leave(`online-quiz-${quizId}`);
      console.log(`User ${socket.id} left room online-quiz-${quizId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
};

// Hàm để phát ra sự kiện từ các nơi khác trong ứng dụng, chỉ phát trong phòng tương ứng
export const emitEvent = (quizId, event, data) => {
  if (io) {
    io.to(`online-quiz-${quizId}`).emit(event, data); // Emit chỉ trong phòng `online-quiz-${quizId}`
  } else {
    console.error('Socket.io is not initialized');
  }
};
