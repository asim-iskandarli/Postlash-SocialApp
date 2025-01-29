import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { MessageType } from "../../types";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const SearchConversation = ({ searchKeyword }: { searchKeyword: string }) => {
  const { conversations } = useAppSelector((state) => state.message);
  const { user } = useAppSelector((state) => state.auth);
  const [result, setResult] = useState<MessageType[]>([]);

  useEffect(() => {
    if (searchKeyword) {
      const searchResults = conversations.filter(
        (c) =>
          (user?.id === c.sender.id
            ? c.receiver.username
                .toLowerCase()
                .includes(searchKeyword.toLowerCase())
            : c.sender.username
                .toLowerCase()
                .includes(searchKeyword.toLowerCase())) ||
          c.content.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setResult(searchResults);
    }
  }, [searchKeyword]);

  return (
    <div>
      {result.length > 0 ? (
        result.map((r: MessageType) => (
          <Link
            key={r.id}
            to={`/messages/${
              user?.id === r.senderId ? r.receiverId : r.senderId
            }`}
            className="flex flex-col sm:flex-row items-center gap-2 p-2 cursor-pointer rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 duration-300"
          >
            <img
              src={
                (user?.id === r.senderId
                  ? r.receiver.avatar
                  : r.sender.avatar) || "/noAvatar.png"
              }
              className="w-14 h-14 rounded-full"
              alt="avatar"
            />
            <div>
              <h4 className="font-semibold dark:text-gray-200 text-xs sm:text-lg">
                {user?.id === r.senderId
                  ? r.receiver.username
                  : r.sender.username}
              </h4>
              <div className="hidden sm:flex gap-4 items-center">
                <div className="flex gap-1">
                  <p className="dark:text-gray-300">{r.content}</p>
                </div>
                <span className="text-xs hidden sm:block text-gray-500 dark:text-gray-400">
                  {dayjs(r.updatedAt).fromNow()}
                </span>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p>Hecbir sohbet tapilmadi</p>
      )}
    </div>
  );
};

export default SearchConversation;
