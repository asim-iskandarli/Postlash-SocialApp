import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import dayjs from "dayjs";
import UserInfo from "./UserInfo";
import { getMessages } from "../../api";
import { useQuery } from "@tanstack/react-query";
import {
  addMessage,
  sendMessage,
  setMessages,
} from "../../redux/message/messageSlice";
import MessageSkeletion from "../skeletons/MessageSkeletion";
import { MessagesDataType, MessageType } from "../../types";
import { Helmet } from "react-helmet-async";

const Messages = ({ userId }: { userId: string }) => {
  const { user } = useAppSelector((state) => state.auth);
  const { messages } = useAppSelector((state) => state.message);
  const socket = useSocket();
  const messagesRef: any = useRef(null);
  const dispatch = useAppDispatch();
  const [messagesData, setMessagesData] = useState<MessagesDataType>({
    user: null,
    messages: [],
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["messages/get", userId],
    queryFn: () => getMessages(userId),
    enabled: false,
  });

  useEffect(() => {
    if (data) {
      dispatch(setMessages(data));
    }
  }, [data]);

  useEffect(() => {
    if (userId) {
      if (
        messages.some(
          (message: MessagesDataType) => message.user?.id === userId
        )
      ) {
        const userMessages: MessagesDataType | undefined = messages.find(
          (message: MessagesDataType) => message.user?.id === data.user.id
        );
        if (userMessages) {
          setMessagesData(userMessages);
        }
      } else {
        refetch();
      }
    }
  }, [userId, messages]);

  useEffect(() => {
    if (socket) {
      socket.on("receive-message", (data) => {
        dispatch(addMessage(data));
      });

      socket.on("send-message", (data) => {
        dispatch(sendMessage(data));
      });
    }
    return () => {
      if (socket) {
        socket.off("receive-message");
        socket.off("send-message");
      }
    };
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesData]);

  if (isLoading) return <MessageSkeletion />;

  return (
    <>
      {messagesData.user && <UserInfo user={messagesData.user} />}
      <div className="flex-1 p-2 overflow-y-auto h-[67vh]">
        <Helmet>
          <title>
            {import.meta.env.VITE_APP_NAME} |{" "}
            {messagesData.user?.fullname || "Söhbətlər"}
          </title>
        </Helmet>
        {messagesData.messages.map((message: MessageType) => (
          <div
            key={message.id}
            className={`w-full flex flex-col mb-2 ${
              message.senderId === user?.id ? "items-end" : "items-start"
            }`}
          >
            <p
              className={`text-white w-max py-2 px-3 rounded-2xl ${
                message.senderId === user?.id ? "bg-sky-400" : "bg-gray-500"
              }`}
            >
              {message.content}
            </p>
            <span className="dark:text-gray-400 text-[10px] mr-2">
              {dayjs(message.createdAt).fromNow()}
            </span>
          </div>
        ))}
        <div ref={messagesRef}></div>
      </div>
    </>
  );
};

export default Messages;
