import { useContext } from "react"; // Import useContext để truy cập AuthContext
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap"; // Import các component từ React Bootstrap
import { AuthContext } from "../context/AuthContext"; // Import AuthContext để lấy dữ liệu đăng ký và hàm cập nhật

// Component Register để tạo form đăng ký
const Register = () => {
   // Lấy các giá trị từ AuthContext: thông tin đăng ký và hàm cập nhật
   const {
      registerInfo,
      updateRegisterInfo,
      registerUser,
      registerError,
      isRegisterLoading,
   } = useContext(AuthContext);
   return (
      <>
         <Form onSubmit={registerUser}>
            <Row
               style={{
                  height: "fit-content",
                  justifyContent: "center",
                  paddingTop: "10%",
               }}
            >
               <Col xs={6}>
                  <Stack gap={3}>
                     <h2>Register</h2>

                     <Form.Control
                        type="text"
                        placeholder="Name"
                        onChange={(e) =>
                           updateRegisterInfo({
                              ...registerInfo, // Giữ lại giá trị hiện tại trong registerInfo
                              name: e.target.value, // Cập nhật giá trị name
                           })
                        }
                     />
                     <Form.Control
                        type="email"
                        placeholder="Email"
                        onChange={(e) =>
                           updateRegisterInfo({
                              ...registerInfo, // Giữ lại giá trị hiện tại trong registerInfo
                              email: e.target.value, // Cập nhật giá trị email
                           })
                        }
                     />
                     <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={(e) =>
                           updateRegisterInfo({
                              ...registerInfo, // Giữ lại giá trị hiện tại trong registerInfo
                              password: e.target.value, // Cập nhật giá trị password
                           })
                        }
                     />
                     <Button type="submit" variant="primary">
                        {isRegisterLoading // Thay đổi text của nút khi đang tải
                           ? "Creating your account"
                           : "Register"}
                     </Button>
                     {registerError?.error && ( // Hiển thị thông báo lỗi nếu có
                        <Alert variant="danger">
                           <p>{registerError?.message}</p>
                        </Alert>
                     )}
                  </Stack>
               </Col>
            </Row>
         </Form>
      </>
   );
};

export default Register;
