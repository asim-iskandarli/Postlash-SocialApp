import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getLatestMessages } from "../../api";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getConversations } from "../../redux/message/messageSlice";
import dayjs from "dayjs";
import ConversationSkeletion from "../skeletons/ConversationSkeletion";
import { MessageType } from "../../types";

const ConversationsList = () => {
  const { conversations } = useAppSelector((state) => state.message);
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useQuery({
    queryKey: ["messages/latest"],
    queryFn: getLatestMessages,
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      dispatch(getConversations(data));
    }
  }, [data]);

  if (isLoading) return <ConversationSkeletion />;

  return (
    <div className="mt-4 flex flex-col gap-4 sm:gap-0">
      {conversations.length > 0 &&
        conversations.map((conversation: MessageType) => (
          <Link
            key={conversation.id}
            to={`/messages/${
              user?.id === conversation.senderId
                ? conversation.receiverId
                : conversation.senderId
            }`}
            className="flex flex-col sm:flex-row items-center gap-2 p-2  cursor-pointer rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 duration-300"
          >
            <img
              src={
                (user?.id === conversation.senderId
                  ? conversation.receiver.avatar
                  : conversation.sender.avatar) || "/noAvatar.png"
              }
              className="w-14 h-14 rounded-full"
              alt="avatar"
            />
            <div className="">
              <h4 className="font-semibold dark:text-gray-200 text-xs sm:text-lg">
                {user?.id === conversation.senderId
                  ? conversation.receiver.username
                  : conversation.sender.username}
              </h4>
              <div className="flex gap-4 items-center">
                <div className="gap-1 hidden sm:flex">
                  <p className="dark:text-gray-300">{conversation.content}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  {dayjs(conversation.updatedAt).fromNow()}
                </span>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default ConversationsList;
