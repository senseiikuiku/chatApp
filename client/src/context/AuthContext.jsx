// Nhập các hàm và hooks cần thiết từ React
import { createContext, useCallback, useEffect, useState } from "react";
// Nhập baseUrl và hàm postRequest từ module services
import { baseUrl, postRequest } from "../utils/services";

// Tạo context cho xác thực người dùng
export const AuthContext = createContext();

// Provider để chia sẻ state về xác thực
export const AUTHContextProvider = ({ children }) => {
   // ========================= Register =========================
   // Quản lý thông tin người dùng (có thể là null nếu chưa đăng nhập)
   const [user, setUser] = useState(null);
   // Quản lý thông báo lỗi khi đăng ký
   const [registerError, setRegisterError] = useState(null);
   // Quản lý trạng thái đang tải khi đăng ký
   const [isRegisterLoading, setIsRegisterLoading] = useState(false);
   // Quản lý thông tin đăng ký người dùng (name, email, password)
   const [registerInfo, setRegisterInfo] = useState({
      name: "",
      email: "",
      password: "",
   });

   // ========================= Login =========================
   // Quản lý thông báo lỗi khi đăng nhập
   const [loginError, setLoginError] = useState(null);
   // Quản lý trạng thái đang tải khi đăng nhập
   const [isLoginLoading, setIsLoginLoading] = useState(false);
   // Quản lý thông tin đăng nhập người dùng (email, password)
   const [loginInfo, setLoginInfo] = useState({
      email: "",
      password: "",
   });

   // In ra console để theo dõi thông tin đăng ký mỗi khi thay đổi
   console.log("registerInfo", registerInfo);
   console.log("Users", user);
   console.log("LoginInfo", loginInfo);

   // Sử dụng useEffect để lấy người dùng từ localStorage
   useEffect(() => {
      const user = localStorage.getItem("User");

      setUser(JSON.parse(user));
   }, []);

   // Hàm cập nhật thông tin đăng ký, sử dụng useCallback để tối ưu hóa
   const updateRegisterInfo = useCallback((info) => {
      setRegisterInfo(info);
   }, []);

   // Hàm cập nhật thông tin đăng nhập, sử dụng useCallback để tối ưu hóa
   const updateLoginInfo = useCallback((info) => {
      setLoginInfo(info);
   }, []);

   const registerUser = useCallback(
      async (e) => {
         e.preventDefault(); // Ngăn chặn hành vi mặc định của form

         setIsRegisterLoading(true); // Bắt đầu trạng thái tải
         setRegisterError(null); // Đặt lại thông báo lỗi

         // Gửi yêu cầu đăng ký đến server
         const response = await postRequest(
            `${baseUrl}/users/register`, // Địa chỉ API cho đăng ký
            JSON.stringify(registerInfo) // Dữ liệu đăng ký được chuyển thành JSON
         );

         // Kết thúc trạng thái tải
         setIsRegisterLoading(false);

         // Kiểm tra nếu có lỗi từ server
         if (response.error) {
            return setRegisterError(response); // Lưu thông báo lỗi
         }

         // Lưu thông tin người dùng vào localStorage
         localStorage.setItem("User", JSON.stringify(response));
         setUser(response); // Cập nhật thông tin người dùng
      },
      [registerInfo] // Hook sẽ phụ thuộc vào registerInfo
   );

   const loginUser = useCallback(
      async (e) => {
         e.preventDefault(); // Ngăn chặn hành vi mặc định của form

         setIsLoginLoading(true); // Bắt đầu trạng thái tải
         setLoginError(null); // Đặt lại thông báo lỗi

         // Gửi yêu cầu đăng nhập đến server
         const response = await postRequest(
            `${baseUrl}/users/login`, // Địa chỉ API cho đăng nhập
            JSON.stringify(loginInfo) // Dữ liệu đăng nhập được chuyển thành JSON
         );

         setIsLoginLoading(false); // Kết thúc trạng thái tải

         // Kiểm tra nếu có lỗi từ server
         if (response.error) {
            return setLoginError(response); // Lưu thông báo lỗi
         }

         // Lưu thông tin người dùng vào localStorage
         localStorage.setItem("User", JSON.stringify(response));
         setUser(response); // Cập nhật thông tin người dùng
      },
      [loginInfo]
   );

   const logoutUser = useCallback(() => {
      localStorage.removeItem("User");
      setUser(null);
   }, []);

   // Trả về provider chứa các giá trị được chia sẻ qua context
   return (
      <AuthContext.Provider
         value={{
            user, // Thông tin người dùng hiện tại
            registerInfo, // Thông tin đăng ký người dùng
            updateRegisterInfo, // Hàm để cập nhật thông tin đăng ký
            registerUser, // Hàm đăng ký người dùng
            registerError, // Thông báo lỗi khi đăng ký
            isRegisterLoading, // Trạng thái tải khi đang đăng ký
            logoutUser, // Hàm đăng xuất người dùng
            loginUser, // Hàm đăng nhập người dùng
            loginError, // Thông báo lỗi khi đăng nhập
            loginInfo, // Thông tin đăng nhập người dùng
            updateLoginInfo, // Hàm để cập nhật thông tin đăng nhập
            isLoginLoading, // Trạng thái tải khi đang đăng nhập
         }}
      >
         {children} {/* Các thành phần con sẽ được bọc bên trong Provider */}
      </AuthContext.Provider>
   );
};
