const express = require("express"); //Import express để sử dụng Router của Express.
const {
   createChat,
   findUserChats,
   findChat,
} = require("../Controllers/ChatController");

const router = express.Router();

//  Route tạo cuộc trò chuyện (POST /)
router.post("/", createChat);
//  Route tìm tất cả các cuộc trò chuyện của một người dùng (GET /:userId)
router.get("/:userId", findUserChats);
// Route tìm cuộc trò chuyện giữa hai người dùng (GET /find/:firstId/:secondId)
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;
