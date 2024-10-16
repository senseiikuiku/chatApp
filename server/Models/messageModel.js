// Import Mongoose để định nghĩa schema và mô hình
const mongoose = require("mongoose");

// Định nghĩa schema cho Message (tin nhắn)
const messageSchema = new mongoose.Schema(
   {
      // ID của cuộc trò chuyện (chat) mà tin nhắn này thuộc về
      chatId: String,

      // ID của người gửi tin nhắn
      senderId: String,

      // Nội dung của tin nhắn
      text: String,
   },
   {
      // Tự động thêm các trường createdAt và updatedAt để lưu thời gian tạo và cập nhật
      timestamps: true,
   }
);

// Tạo model Message dựa trên schema đã định nghĩa
const messageModel = mongoose.model("Message", messageSchema);

// Xuất model để sử dụng trong các phần khác của ứng dụng
module.exports = messageModel;
