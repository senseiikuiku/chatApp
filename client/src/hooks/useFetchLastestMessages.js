import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchLatesMessages = (chat) => {
   const { newMessage, notification } = useContext(ChatContext);
   const [latestMessages, setLatestMessages] = useState(null);

   useEffect(() => {
      const getMessages = async () => {
         const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

         if (response.error) {
            console.log("Error getting messages...", response.error);
            return;
         }

         if (response.length > 0) {
            const lastMessage = response[response.length - 1];
            setLatestMessages(lastMessage);
         }
      };

      getMessages();
   }, [newMessage, notification]);

   return { latestMessages };
};
