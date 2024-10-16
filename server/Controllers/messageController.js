// Import model messageModel để tương tác với cơ sở dữ liệu
const messageModel = require("../Models/messageModel");

// createMessage
// Hàm tạo tin nhắn
const createMessage = async (req, res) => {
   // Lấy chatId, senderId và text từ request body
   const { chatId, senderId, text } = req.body;

   // Tạo một instance mới của messageModel với dữ liệu từ request
   const message = new messageModel({
      chatId,
      senderId,
      text,
   });

   try {
      // Lưu tin nhắn vào cơ sở dữ liệu
      const response = await message.save();
      // Trả về phản hồi với status 200 nếu thành công và dữ liệu tin nhắn đã luw
      res.status(200).json(response);
   } catch (error) {
      // In ra lỗi nếu có giá trị trả về status 500 (lỗi server)
      console.log(error);
      res.status(500).json(error);
   }
};

// getMessage
// Hàm lấy tin nhắn dựa chọn chatId
const getMessage = async (req, res) => {
   // Lấy chatId từ request params
   const { chatId } = req.params;
   try {
      // Tìm tất cả các tin nhắn thuộc về chatId đã chỉ định
      const messages = await messageModel.find({ chatId });
      // Trả về danh sách tin nhắn với status 200 nếu thành công
      res.status(200).json(messages);
   } catch (error) {
      // In ra lỗi nếu trả về status 500 (lỗi server)
      console.log(error);
      res.status(500).json(error);
   }
};

// Xuất các hàm để sử dụng trong các route
module.exports = { createMessage, getMessage };
