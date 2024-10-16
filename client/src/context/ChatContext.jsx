import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";
// Tạo một context mới để chia sẻ thông tin về các cuộc trò chuyện (chat) giữa các component
export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
   // Khai báo các state để quản lý danh sách chat của người dùng, trạng thái loading, và lỗi
   const [userChats, setUserChats] = useState(null); // Lưu trữ các cuộc trò chuyện của người dùng
   const [isUserChatsLoading, setIsUserChatsLoading] = useState(false); // Quản lý trạng thái loading khi gọi API lấy danh sách chat
   const [userChatsError, setUserChatsError] = useState(null); // Lưu trữ thông tin lỗi nếu có khi lấy danh sách chat
   const [potentialChats, setPotentialChats] = useState([]); // Danh sách các cuộc trò chuyện tiềm năng (người dùng có thể trò chuyện)
   const [currentChat, setCurrentChat] = useState(null);
   const [messages, setMessages] = useState(null);
   const [isMessagesLoading, setIsMessagesLoading] = useState(false);
   const [messagesError, setMessagesError] = useState(null);
   const [sendTextMessageError, setSendTextMessageError] = useState(null);
   const [newMessage, setNewMessage] = useState(null);
   const [socket, setSocket] = useState(null);
   const [onLineUsers, setOnLineUsers] = useState([]);
   const [notification, setNotification] = useState([]);
   const [allUsers, setAllUsers] = useState([]);

   console.log("onLineUsers", onLineUsers);
   console.log("notification", notification);

   // initial socket
   useEffect(() => {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL);
      setSocket(newSocket);

      return () => {
         newSocket.disconnect();
      };
   }, [user]);

   // add online user
   useEffect(() => {
      if (socket === null) return;

      socket.emit("addNewUser", user?._id); // Gửi sự kiện khi kết nối thành công
      socket.on("getOnLineUsers", (res) => {
         setOnLineUsers(res); // Cập nhật trạng thái người dùng trực tuyến
      });

      return () => {
         socket.off("getOnLineUers");
      };
   }, [socket]);

   // send Message
   useEffect(() => {
      if (socket === null) return; // Kiểm tra xem socket có hợp lệ không

      const recipientId = currentChat?.members.find((id) => id !== user?._id); // Tìm ID của người nhận

      socket.emit("sendMessage", { ...newMessage, recipientId }); // Gửi tin nhắn đến server
   }, [newMessage]); // Phụ thuộc vào newMessage

   // receive message and notification
   useEffect(() => {
      if (socket === null) return; // Kiểm tra xem socket có hợp lệ không

      socket.on("getMessage", (res) => {
         // Lắng nghe sự kiện "getMessage" từ server
         if (currentChat?._id !== res.chatId) return; // Nếu chatId không khớp với currentChat, không xử lý

         setMessages((prev) => {
            return [...prev, res]; // Cập nhật trạng thái messages bằng cách thêm tin nhắn mới vào danh sách
         });
      });

      // Xử lý sự kiện "getNotification"
      socket.on("getNotification", (res) => {
         // Kiểm tra xem người gửi tin nhắn có phải là thành viên của cuộc trò chuyện đang mở không
         const isChatOpen = currentChat?.members.some(
            (id) => id === res.senderId
         );

         if (isChatOpen) {
            // Nếu cuộc trò chuyện đang mở, thêm thông báo vào danh sách và đánh dấu là đã đọc
            setNotification((prev) => [{ ...res, isRead: true }, ...prev]);
         } else {
            // Nếu cuộc trò chuyện không mở, chỉ thêm thông báo mà không đánh dấu đã đọc
            setNotification((prev) => [res, ...prev]);
         }
      });

      return () => {
         socket.off("getMessage"); // Ngắt đăng ký sự kiện khi component unmount
         socket.off("getNotification");
      };
   }, [socket, currentChat]);

   useEffect(() => {
      const getUsers = async () => {
         // Gọi API để lấy danh sách người dùng
         const response = await getRequest(`${baseUrl}/users`);
         if (response.error) {
            return console.log("Error fetching users", response);
         }

         // Lọc ra những người dùng mà người hiện tại chưa có cuộc trò chuyện nào
         const pChats = response.filter((U) => {
            let ischatCreated = false;

            // Loại bỏ chính người dùng
            if (user?._id === U._id) return false;

            if (userChats) {
               // Kiểm tra xem đã có cuộc trò chuyện với người dùng này chưa
               ischatCreated = userChats?.some((chat) => {
                  return chat.members[0] === U._id || chat.members[1] === U._id;
               });
            }

            // Chỉ trả về người chưa có cuộc trò chuyện
            return !ischatCreated;
         });

         // Cập nhật danh sách người dùng tiềm năng
         setPotentialChats(pChats);
         setAllUsers(response);
      };

      // Gọi hàm getUsers khi component được render
      getUsers();
   }, [userChats]); // Phụ thuộc vào userChats, khi có sự thay đổi, effect sẽ chạy lại

   const sendTextMessage = useCallback(
      async (textMessage, sender, currentChatId, setTextMessage) => {
         if (!textMessage) return console.log("You must type something...");

         const response = await postRequest(
            `${baseUrl}/messages`,
            JSON.stringify({
               chatId: currentChatId,
               senderId: sender._id,
               text: textMessage,
            })
         );

         if (response.error) {
            return setSendTextMessageError(response);
         }

         setNewMessage(response);
         setMessages((prev) => [...prev, response]);

         setTextMessage("");
      },
      []
   );

   // useEffect được kích hoạt khi giá trị của 'user' thay đổi (người dùng mới đăng nhập hoặc thông tin người dùng thay đổi)
   useEffect(() => {
      const getUserChats = async () => {
         // Kiểm tra xem có thông tin người dùng và user._id hay không
         if (user?._id) {
            setIsUserChatsLoading(true); // Bắt đầu quá trình loading
            setUserChatsError(null); // Xóa lỗi cũ nếu có

            // Gọi API để lấy danh sách các cuộc trò chuyện của người dùng dựa trên user._id
            const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

            setIsUserChatsLoading(false); // Dừng loading sau khi nhận được phản hồi

            // Nếu có lỗi từ API, cập nhật biến state chứa lỗi
            if (response.error) {
               return setUserChatsError(response); // Lưu lỗi vào state
            }

            // Nếu thành công, cập nhật danh sách các cuộc trò chuyện vào state
            setUserChats(response);
         }
      };

      // Gọi hàm getUserChats mỗi khi 'user' thay đổi
      getUserChats();
   }, [user,notification]); // Phụ thuộc vào 'user', nếu 'user' thay đổi, effect sẽ chạy lại

   useEffect(() => {
      const getMessages = async () => {
         setIsMessagesLoading(true);
         setMessagesError(null);

         const response = await getRequest(
            `${baseUrl}/messages/${currentChat?._id}`
         );

         setIsMessagesLoading(false);

         if (response.error) {
            return setUserChatsError(response);
         }

         setMessages(response);
      };
      getMessages();
   }, [currentChat]);

   const updateCurrentChat = useCallback((chat) => {
      setCurrentChat(chat);
   }, []);

   // Hàm tạo cuộc trò chuyện mới giữa hai người dùng
   const createChat = useCallback(async (firstId, secondId) => {
      // Gọi API để tạo cuộc trò chuyện mới
      const response = await postRequest(
         `${baseUrl}/chats`,
         JSON.stringify({
            firstId,
            secondId,
         })
      );

      // Nếu có lỗi trong quá trình tạo chat, log lỗi ra console
      if (response.error) {
         return console.log("Error creating chat", response);
      }

      // Nếu tạo thành công, thêm cuộc trò chuyện mới vào danh sách cuộc trò chuyện hiện tại
      setUserChats((prev) => [...prev, response]);
   }, []); // Hàm này không phụ thuộc vào bất kỳ state nào ngoài createChat

   const markAllNoticationsAsRead = useCallback((notification) => {
      const mNofications = notification.map((n) => {
         return { ...n, isRead: true };
      });

      setNotification(mNofications);
   }, []);

   const markNotificationAsRead = useCallback(
      (n, userChats, user, notification) => {
         // find chat to open

         const desiredChat = userChats.find((chat) => {
            const chatMembers = [user._id, n.senderId];
            const isDesiredChat = chat?.members.every((members) => {
               return chatMembers.includes(members);
            });

            return isDesiredChat;
         });
         // mark notification as read
         const mNotifications = notification.map((el) => {
            if (n.senderId === el.senderId) {
               return { ...n, isRead: true };
            } else {
               return el;
            }
         });

         updateCurrentChat(desiredChat);
         setNotification(mNotifications);
      },
      []
   );

   const markThisUserNotificationAsRead = useCallback(
      (thisUserNotification, notification) => {
         // mark notification as read

         const mNotification = notification.map((el) => {
            let notification;
            thisUserNotification.forEach((n) => {
               if (n.senderId === el.senderId) {
                  notification = { ...n, isRead: true };
               } else {
                  notification = el;
               }
            });

            return notification;
         });

         setNotification(mNotification);
      },
      []
   );

   return (
      // ChatContext.Provider giúp cung cấp các giá trị cho các component con
      <ChatContext.Provider
         value={{
            userChats, // Danh sách các cuộc trò chuyện của người dùng
            isUserChatsLoading, // Trạng thái loading khi gọi API
            userChatsError, // Lỗi nếu có trong quá trình lấy danh sách chat
            potentialChats, // Danh sách người dùng có thể bắt đầu cuộc trò chuyện
            createChat, // Hàm tạo cuộc trò chuyện
            updateCurrentChat,
            messages,
            isMessagesLoading,
            messagesError,
            currentChat,
            sendTextMessage,
            onLineUsers,
            notification,
            allUsers,
            markAllNoticationsAsRead,
            markNotificationAsRead,
            markThisUserNotificationAsRead,
         }}
      >
         {children}{" "}
         {/* Render các component con được bọc trong ChatContextProvider */}
      </ChatContext.Provider>
   );
};
