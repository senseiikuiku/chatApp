import { useEffect, useState } from "react"; // Import các hook useEffect và useState để quản lý trạng thái và hiệu ứng
import { baseUrl, getRequest } from "../utils/services"; // Import các hàm dịch vụ để thực hiện các yêu cầu HTTP

// Custom hook: useFetchRecipientUser
// Dùng để tìm kiếm và lấy thông tin của người nhận trong cuộc trò chuyện dựa trên thông tin cuộc trò chuyện và người dùng hiện tại
export const useFetchRecipientUser = (chat, user) => {
   // Trạng thái để lưu trữ thông tin của người nhận
   const [recipientUser, setRecipientUser] = useState(null);
   // Trạng thái để lưu trữ lỗi nếu có vấn đề khi fetch dữ liệu
   const [error, setError] = useState(null);

   // Lấy recipientId từ danh sách members trong cuộc trò chuyện, tìm ID khác với user hiện tại
   const recipientId = chat?.members.find((id) => id !== user?._id);

   // Sử dụng useEffect để thực hiện side effect: lấy thông tin người nhận
   useEffect(() => {
      const getUser = async () => {
         // Nếu không có recipientId, không thực hiện gì
         if (!recipientId) return null;

         // Gửi yêu cầu GET đến server để lấy thông tin người nhận
         const response = await getRequest(
            `${baseUrl}/users/find/${recipientId}` // URL để lấy người dùng dựa trên recipientId
         );

         // Nếu có lỗi, lưu lỗi vào state
         if (response.error) {
            return setError(error);
         }

         // Lưu thông tin người nhận vào state
         setRecipientUser(response);
      };

      // Gọi hàm getUser để thực hiện yêu cầu
      getUser();
   }, [recipientId]); // Mảng dependency trống nghĩa là useEffect chỉ chạy một lần khi component được mount

   // Trả về thông tin người nhận (recipientUser) và lỗi (error) nếu có
   return { recipientUser };
};
