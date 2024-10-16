import { Stack } from "react-bootstrap"; // Import Stack component từ React Bootstrap để sắp xếp theo chiều ngang/chiều dọc
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient"; // Import custom hook để fetch thông tin người nhận
import avatar from "../../assets/avatar.svg"; // Import ảnh đại diện mặc định
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotification";
import { useFetchLatesMessages } from "../../hooks/useFetchLastestMessages";
import moment from "moment";

// Component UserChat: Hiển thị thông tin của một cuộc trò chuyện giữa người dùng hiện tại và người nhận
const UserChat = ({ chat, user }) => {
   // Sử dụng custom hook để lấy thông tin người nhận (recipientUser) dựa trên cuộc trò chuyện và người dùng hiện tại
   const { recipientUser } = useFetchRecipientUser(chat, user);
   const { onLineUsers, notification, markThisUserNotificationAsRead } =
      useContext(ChatContext);
   const { latestMessages } = useFetchLatesMessages(chat);

   const unreadNotification = unreadNotificationsFunc(notification);
   const thisUserNotifications = unreadNotification?.filter(
      (n) => n.senderId === recipientUser?._id
   );
   const isOnline = onLineUsers?.some(
      (user) => user?.userId === recipientUser?._id
   );

   const truncateText = (text) => {
      let shortText = text.substring(0, 20);

      if (text.length > 20) {
         shortText = shortText + "...";
      }

      return shortText;
   };

   // In ra console thông tin người nhận để kiểm tra
   console.log(recipientUser);

   console.log("latestMessages", latestMessages);

   return (
      // Sử dụng Stack từ React Bootstrap để sắp xếp các phần tử theo chiều ngang (horizontal)
      <Stack
         direction="horizontal"
         gap={3} // Khoảng cách giữa các phần tử trong Stack
         className="user-card align-items-center p-2 justify-content-between" // Thêm các class để tạo kiểu cho Stack
         role="button" // Đặt role là button để chỉ rõ rằng phần tử có thể được nhấn
         onClick={() => {
            if (thisUserNotifications?.length !== 0) {
               markThisUserNotificationAsRead(
                  thisUserNotifications,
                  notification
               );
            }
         }}
      >
         {/* Phần bên trái hiển thị avatar và thông tin người nhận */}
         <div className="d-flex">
            <div className="me-2">
               {/* Hiển thị ảnh đại diện người dùng */}
               <img src={avatar} alt="avatar" height="35px" />
            </div>
            <div className="text-content">
               {/* Hiển thị tên người nhận (nếu tồn tại) */}
               <div className="name">{recipientUser?.name}</div>
               {/* Hiển thị tin nhắn gần nhất (hiện tại đang hiển thị "Text Message" tĩnh) */}
               <div className="text">
                  {latestMessages?.text && (
                     <span>{truncateText(latestMessages?.text)}</span>
                  )}
               </div>
            </div>
         </div>

         {/* Phần bên phải hiển thị ngày, số thông báo, và trạng thái online */}
         <div className="d-flex flex-column align-items-end">
            {/* Hiển thị ngày (hiện tại là giá trị tĩnh) */}
            <div className="date">
               {moment(latestMessages?.createdAt).calendar()}
            </div>
            {/* Hiển thị số thông báo tin nhắn chưa đọc (giá trị tĩnh) */}
            <div
               className={
                  thisUserNotifications?.length > 0
                     ? "this-user-notifications"
                     : ""
               }
            >
               {thisUserNotifications?.length
                  ? thisUserNotifications?.length
                  : ""}
            </div>
            {/* Hiển thị trạng thái online của người dùng (chưa được triển khai) */}
            <div className={isOnline ? "user-online" : ""}></div>
         </div>
      </Stack>
   );
};

export default UserChat;
