// Import user model để tương tác với database MongoDB
const userModel = require("../Models/userModel");
// Import bcrypt để mã hóa mật khẩu và kiểm tra mật khẩu
const bcrypt = require("bcrypt");
// Import validator để xác thực email và mật khẩu
const validator = require("validator");
// Import jsonwebtoken để tạo JWT cho xác thực
const jwt = require("jsonwebtoken");

// Hàm tạo JWT token với user ID và thời hạn 3 ngày
const createToken = (_id) => {
    // Lấy khóa bí mật từ file .env
    const jwtkey = process.env.JWT_SECRET_KEY;

    // Tạo và trả về JWT token
    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

// Xử lý logic khi người dùng đăng ký
const registerUser = async (req, res) => {
    try {
        // Lấy dữ liệu từ body của request
        const { name, email, password } = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        let user = await userModel.findOne({ email });

        // Trả về lỗi nếu email đã tồn tại
        if (user)
            return res
                .status(400)
                .json("User with the given email already exist...");

        // Kiểm tra nếu thiếu trường nào
        if (!name || !email || !password)
            // Trả về lỗi nếu thiếu trường
            return res.status(400).json("All fields are required");

        // Kiểm tra tính hợp lệ của email
        if (!validator.isEmail(email))
            // Trả về lỗi nếu email không hợp lệ
            return res.status(400).json("Email must be a valid email...");

        // Kiểm tra tính mạnh của mật khẩu
        if (!validator.isStrongPassword(password))
            // Trả về lỗi nếu mật khẩu không đủ mạnh
            return res
                .status(400)
                .json("Password must be a strong password...");

        // Tạo mới người dùng (chưa lưu vào database)
        user = new userModel({ name, email, password });

        // Mã hóa mật khẩu trước khi lưu vào database
        // Tạo chuỗi salt ngẫu nhiên
        const salt = await bcrypt.genSalt(10);
        // Mã hóa mật khẩu với salt
        user.password = await bcrypt.hash(user.password, salt);

        // Lưu người dùng vào database
        await user.save();

        // Tạo token JWT cho người dùng mới
        const token = createToken(user._id);

        // Trả về phản hồi thành công cùng với token và thông tin người dùng
        res.status(200).json({ _id: user._id, name, email, token });
    } catch (error) {
        // Bắt và log lỗi trong quá trình đăng ký
        console.error("Error occurred during user registration:", error);
        res.status(500).json({
            // Trả về thông báo lỗi chung cho client
            message: "Internal server error",
            // Log thêm chi tiết lỗi (có thể ẩn trong production)
            error: error.message,
        });
    }
};

// Xử lý logic khi người dùng đăng nhập
const loginUser = async (req, res) => {
    // Lấy dữ liệu từ body của request
    const { email, password } = req.body;

    try {
        // Tìm người dùng theo email
        let user = await userModel.findOne({ email });

        // Trả về lỗi nếu không tìm thấy người dùng
        if (!user) return res.status(400).json("Invalid email or password...");

        // So sánh mật khẩu đã nhập với mật khẩu trong database
        const isValidPassword = await bcrypt.compare(password, user.password);

        // Trả về lỗi nếu mật khẩu không đúng
        if (!isValidPassword)
            return res.status(400).json("Invalid email or password...");

        // Tạo token JWT khi đăng nhập thành công
        const token = createToken(user._id);

        // Trả về phản hồi thành công với thông tin người dùng và token
        res.status(200).json({ _id: user._id, name: user.name, email, token });
    } catch (error) {
        // Bắt và log lỗi trong quá trình đăng nhập
        console.error("Error occurred during login user:", error);
        res.status(500).json({
            // Trả về thông báo lỗi chung cho client
            message: "Internal server error",
            // Log thêm chi tiết lỗi (có thể ẩn trong production)
            error: error.message,
        });
    }
};

// Tìm người dùng theo ID
const findUser = async (req, res) => {
    // Lấy userId từ tham số URL
    const userId = req.params.userId;

    try {
        // Tìm người dùng theo ID
        const user = await userModel.findById(userId);

        // Trả về thông tin người dùng
        res.status(200).json(user);
    } catch (error) {
        // Bắt và log lỗi trong quá trình tìm kiếm người dùng
        console.error("Error occurred during find user:", error);
        res.status(500).json({
            // Trả về thông báo lỗi chung cho client
            message: "Internal server error",
            // Log thêm chi tiết lỗi (có thể ẩn trong production)
            error: error.message,
        });
    }
};

// Lấy ra tất cả người dùng
const getUsers = async (req, res) => {
    try {
        // Tìm tất cả người dùng trong cơ sở dữ liệu
        const users = await userModel.find();

        // Trả về danh sách người dùng với trạng thái 200 (ok)
        res.status(200).json(users);
    } catch (error) {
        // Nếu có lỗi xảy ra trong quá trình lấy người dùng, in lỗi ra console
        console.error("Error occurred during get user:", error);
        // Trả về mã trạng thái 500 (Internal Server Error) cùng với thông báo lỗi
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Xuất các function để sử dụng trong các route
module.exports = { registerUser, loginUser, findUser, getUsers };
