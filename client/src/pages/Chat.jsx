import { useContext } from "react"; // Import useContext để truy cập dữ liệu từ các context
import { ChatContext } from "../context/ChatContext"; // Import ChatContext để lấy dữ liệu liên quan đến cuộc trò chuyện
import { Container, Stack } from "react-bootstrap"; // Import các thành phần từ react-bootstrap
import UserChat from "../components/chat/userChat"; // Import component UserChat để hiển thị thông tin chat của người dùng
import { AuthContext } from "../context/AuthContext"; // Import AuthContext để lấy thông tin người dùng hiện tại
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox"

// Component Chat: hiển thị danh sách các cuộc trò chuyện của người dùng và khung chat
const Chat = () => {
   // Lấy thông tin người dùng từ AuthContext
   const { user } = useContext(AuthContext);

   // Lấy dữ liệu chat của người dùng, trạng thái tải và lỗi từ ChatContext
   const { userChats, isUserChatsLoading, updateCurrentChat } =
      useContext(ChatContext);

   // In ra console danh sách các cuộc trò chuyện của người dùng để kiểm tra
   console.log("UserChats", userChats);

   return (
      <Container>
         <PotentialChats />
         {/* Kiểm tra nếu không có cuộc trò chuyện nào thì không hiển thị gì */}
         {userChats?.length < 1 ? null : (
            <Stack direction="horizontal" gap={4}>
               {/* Hiển thị danh sách các cuộc trò chuyện bên trái */}
               <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                  {/* Nếu đang tải dữ liệu chat thì hiển thị thông báo "Loading chats..." */}
                  {isUserChatsLoading && <p>Loading chats...</p>}
                  {/* Duyệt qua danh sách các cuộc trò chuyện và hiển thị từng cuộc trò chuyện */}
                  {userChats?.map((chat, index) => {
                     return (
                        <div
                           key={index}
                           onClick={() => updateCurrentChat(chat)}
                        >
                           {/* Sử dụng component UserChat để hiển thị thông tin từng cuộc trò chuyện */}
                           <UserChat chat={chat} user={user} />
                        </div>
                     );
                  })}
               </Stack>
               {/* Khu vực khung chat bên phải */}
               <ChatBox/>
            </Stack>
         )}
      </Container>
   );
};

export default Chat;
