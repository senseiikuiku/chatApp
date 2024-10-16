import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
   const { user } = useContext(AuthContext);

   const { potentialChats, createChat, onLineUsers } = useContext(ChatContext);
   return (
      <>
         <div className="all-users">
            {potentialChats &&
               potentialChats.map((u, index) => {
                  return (
                     <div
                        className="single-user"
                        key={index}
                        onClick={() => createChat(user._id, u._id)}
                     >
                        {u.name}
                        <span
                           className={
                              onLineUsers?.some(
                                 (user) => user?.userId === u?._id
                              )
                                 ? "user-online"
                                 : ""
                           }
                        ></span>
                     </div>
                  );
               })}
         </div>
      </>
   );
};

export default PotentialChats;
