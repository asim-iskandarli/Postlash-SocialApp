import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { useEffect, useState } from "react";
import { UserType } from "../../types";

const UserInfo = ({ user }: { user: UserType }) => {
  const [isOnline, setIsOnline] = useState(false);

  const { activeUsers } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (
      activeUsers.length > 0 &&
      activeUsers.find((active: UserType) => active.id === user.id)
    ) {
      setIsOnline(true);
    } else {
      setIsOnline(false);
    }
  }, [activeUsers, user.id]);

  return (
    <>
      {user && (
        <Link
          to={`/profile/${user.username}`}
          className="flex flex-1 items-center gap-2 p-2 border-b border-b-gray-200 dark:border-b-gray-700"
        >
          <img
            src={user.avatar || "/noAvatar.png"}
            className="w-14 h-14 rounded-full"
            alt="avatar"
          />
          <div className="flex gap-2 items-center">
            <h2 className="font-semibold dark:text-gray-200">
              {user?.username}
            </h2>
            <p
              className={`w-2 h-2 ${
                isOnline ? "bg-green-400" : "bg-gray-400"
              } rounded-full`}
            ></p>
          </div>
        </Link>
      )}
    </>
  );
};

export default UserInfo;
