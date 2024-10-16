const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
   {
      members: Array, // Mảng chứa các thành viên trong cuộc trò chuyện
   },
   {
      timestamps: true, // Tự động tạo các trường `createdAt` và `updatedAt`
   }
);

const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;
