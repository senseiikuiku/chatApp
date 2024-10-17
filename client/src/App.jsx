import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";

// Component App: Là component chính của ứng dụng
function App() {
   // Sử dụng useContext để lấy thông tin user từ AuthContext
   const { user } = useContext(AuthContext);

   return (
      // ChatContextProvider bao bọc ứng dụng để cung cấp dữ liệu chat cho các thành phần con
      <ChatContextProvider user={user}>
         <NavBar />
         {/* Bao bọc nội dung trang trong Container để căn chỉnh */}
         <Container>
            {/* Cấu hình các tuyến đường (routes) cho ứng dụng */}
            <Routes>
               {/* Đường dẫn "/" hiển thị trang Chat */}
               <Route path="/" element={user ? <Chat /> : <Login />} />

               {/* Đường dẫn "/register" hiển thị trang Đăng ký */}
               <Route
                  path="/register"
                  element={user ? <Chat /> : <Register />}
               />

               {/* Đường dẫn "/login" hiển thị trang Đăng nhập */}
               <Route path="/login" element={user ? <Chat /> : <Login />} />

               {/* Đường dẫn không tồn tại sẽ điều hướng về trang chủ */}
               <Route path="*" element={<Navigate to="/" />} />
            </Routes>
         </Container>
      </ChatContextProvider>
   );
}

export default App;
