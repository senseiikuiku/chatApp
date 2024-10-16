// Import Express để tạo server
const express = require("express");
// Import CORS để cho phép giao tiếp giữa các domain khác nhau
const cors = require("cors");
// Import Mongoose để làm việc với MongoDB
const mongoose = require("mongoose");
const { Server } = require("socket.io");

// Import các route liên quan đến người dùng từ file userRoute
const userRoute = require("./Routes/userRoute");
// Import các route liên quan đến chat dùng từ file chatRoute
const chatRoute = require("./Routes/chatRoute");
// Import các route liên quan đến message dùng từ file messageRoute
const messageRoute = require("./Routes/messageRoute");

// Tạo một instance của ứng dụng Express
const app = express();
// Import dotenv để lấy các biến môi trường từ file .env
require("dotenv").config();

// Middleware để parse các request có định dạng JSON
app.use(express.json());
// Sử dụng CORS để cho phép các request từ các nguồn khác
app.use(cors());
// Tất cả các route liên quan đến người dùng sẽ bắt đầu với /api/users
app.use("/api/users", userRoute);
// Tất cả các route liên quan đến chat sẽ bắt đầu với /api/chats
app.use("/api/chats", chatRoute);
// Tất cả các route liên quan đến các messages sẽ bắt đầu với /api/messages
app.use("/api/messages", messageRoute);

// Route chính để kiểm tra server
app.get("/", (req, res) => {
   // Khi truy cập root ("/"), trả về thông báo chào mừng
   res.send("Welcome our chat app APIs...");
});

// Lấy cổng từ biến môi trường hoặc mặc định là 5000
const port = process.env.PORT || 5000;
// Lấy URI kết nối MongoDB từ biến môi trường
const uri = process.env.ATLAS_URI;

// In ra console rằng server đã chạy thành công trên cổng chỉ định
const expressServer = app.listen(port, (req, res) => {
   console.log(`Server running on port: ${port}`);
});

// Kết nối tới MongoDB
mongoose
   .connect(uri, {
      // Sử dụng trình phân tích cú pháp URL mới, tuy nhiên tùy chọn này đã bị deprecate
      useNewUrlParser: true,
      // Sử dụng unified topology, tùy chọn này cũng đã bị deprecate
      useUnifiedTopology: true,
   })
   .then(() => console.log("MongoDB connection established")) // Kết nối thành công
   .catch((error) =>
      // Kết nối thất bại, in lỗi ra console
      console.log("MongoDB connection failed: ", error.message)
   );

// Khởi tạo một server Socket.IO với cấu hình CORS cho phép kết nối từ client ở http://localhost:5173
const io = new Server(expressServer, {
   cors: {
      origin: process.env.CLIENT_URL,
   }, // Client có thể là React hoặc bất kỳ client nào chạy ở cổng 5173
});

let onLineUsers = []; // Tạo một mảng rỗng để lưu trữ thông tin về người dùng đang trực tuyến

// Lắng nghe sự kiện kết nối của socket
io.on("connection", (socket) => {
   console.log("new connection", socket.id); // Log ra ID của socket mới khi có người dùng kết nối

   // Lắng nghe sự kiện "addNewUser" từ client khi người dùng mới được thêm vào hệ thống
   socket.on("addNewUser", (userId) => {
      console.log("User connected with id:", userId);
      // Kiểm tra nếu user chưa có trong danh sách onLineUsers, thì thêm người dùng mới với userId và socketId
      !onLineUsers.some((user) => user.userId === userId) &&
         onLineUsers.push({
            userId, // ID của người dùng
            socketId: socket.id, // ID của socket mà người dùng đang kết nối
         });

      console.log("onLineUsers", onLineUsers); // Log danh sách người dùng trực tuyến

      // Gửi danh sách người dùng trực tuyến đến tất cả các client
      io.emit("getOnLineUsers", onLineUsers);
   });

   // add message
   socket.on("sendMessage", (message) => {
      console.log("Received message:", message);
      const user = onLineUsers.find(
         (user) => user.userId === message.recipientId // Tìm người nhận trong danh sách người dùng trực tuyến
      );

      if (user) {
         // Nếu người nhận đang trực tuyến, gửi tin nhắn đến họ
         io.to(user.socketId).emit("getMessage", message);

         // Gửi thêm một sự kiện `getNotification` cho người nhận để cập nhật thông báo về tin nhắn mới
         io.to(user.socketId).emit("getNotification", {
            senderId: message.senderId,
            isRead: false,
            date: new Date(),
         });
      }
   });

   // Lắng nghe sự kiện khi người dùng ngắt kết nối (disconnect)
   socket.on("disconnect", () => {
      // Khi socket ngắt kết nối, loại bỏ người dùng ra khỏi danh sách online dựa vào socketId
      onLineUsers = onLineUsers.filter((user) => user.socketId !== socket.id);

      // Gửi danh sách người dùng trực tuyến mới đến tất cả các client
      io.emit("getOnLineUsers", onLineUsers);
   });
});
