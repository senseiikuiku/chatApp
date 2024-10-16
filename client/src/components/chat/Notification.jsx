import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotification";
import moment from "moment";

const Notification = () => {
   const [isOpen, setIsOpen] = useState(false);
   const { user } = useContext(AuthContext);
   const {
      notification,
      userChats,
      allUsers,
      markAllNoticationsAsRead,
      markNotificationAsRead,
   } = useContext(ChatContext);

   // Đây là mảng chứa các thông báo chưa đọc.
   const unreadNotification = unreadNotificationsFunc(notification);
   // Đây là mảng chứa tất cả thông báo
   const modifiedNotifications = notification.map((n) => {
      const sender = allUsers.find((user) => user._id === n.senderId);

      return {
         ...n,
         senderName: sender?.name, // sẽ được bổ sung thêm thuộc tính senderName, chứa tên của người gửi.
      };
   });
   console.log("un", unreadNotification);
   console.log("mn", modifiedNotifications);

   return (
      <div className="notifications">
         <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="20"
               height="20"
               fill="currentColor"
               className="bi bi-chat-left-fill"
               viewBox="0 0 16 16"
            >
               <path d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
            </svg>
            {unreadNotification?.length === 0 ? null : (
               <span className="notification-count">
                  <span>{unreadNotification?.length}</span>
               </span>
            )}
         </div>
         {isOpen ? (
            <div className="notifications-box">
               <div className="notifications-header">
                  <h3>Notifications</h3>
                  <div
                     className="mark-as-read"
                     onClick={() => markAllNoticationsAsRead(notification)}
                  >
                     Mark all as read
                  </div>
               </div>
               {modifiedNotifications?.length === 0 ? (
                  <span className="notification">No notification yet...</span>
               ) : null}
               {modifiedNotifications &&
                  modifiedNotifications.map((n, index) => {
                     return (
                        <div
                           key={index}
                           className={
                              n.isRead
                                 ? "notification"
                                 : "notification not-read"
                           }
                           onClick={() => {
                              markNotificationAsRead(
                                 n,
                                 userChats,
                                 user,
                                 notification
                              );

                              setIsOpen(false);
                           }}
                        >
                           <span>{`${n.senderName} sent you a new message`}</span>
                           <span className="notification-time">
                              {moment(n.date).calendar()}
                           </span>
                        </div>
                     );
                  })}
            </div>
         ) : null}
      </div>
   );
};

export default Notification;
