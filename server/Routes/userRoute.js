// Import Express để tạo các route
const express = require("express");
const {
    // Hàm xử lý logic đăng ký người dùng
    registerUser,
    // Hàm xử lý logic đăng nhập người dùng
    loginUser,
    // Hàm xử lý logic tìm người dùng theo ID
    findUser,
    // Hàm xử lý logic lấy các người dùng
    getUsers,
} = require("../Controllers/userController");// Import các hàm từ controller để sử dụng trong các route

// Tạo một instance của Router để định nghĩa các route
const router = express.Router();

// Route đăng ký người dùng mới
router.post("/register", registerUser);// POST request tới /register sẽ gọi hàm registerUser để xử lý logic đăng ký
// Route đăng nhập người dùng
router.post("/login", loginUser);// POST request tới /login sẽ gọi hàm loginUser để xử lý logic đăng nhập
// Route tìm người dùng theo userId
router.get("/find/:userId", findUser);// GET request tới /find/:userId sẽ gọi hàm findUser để tìm và trả về người dùng theo ID
// Route lấy hết tất cả người dùng
router.get("/", getUsers);// GET request tới / sẽ gọi hàm getUsers và trả về hết tất cả người dùng

// Xuất module router để sử dụng trong các file khác (như server.js)
module.exports = router;
