import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getNewUsers } from "../../api";
import { useNavigate } from "react-router-dom";
import { UserType } from "../../types";

const Discover = () => {
  const [newUsers, setNewusers] = useState([]);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["user/newusers"],
    queryFn: getNewUsers,
  });

  useEffect(() => {
    if (data) {
      setNewusers(data);
    }
  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-800 w-full h-max rounded-lg shadow-sm p-4">
      <h2 className="font-semibold text-gray-500 dark:text-gray-300">
        Yeni istifadəçilər
      </h2>
      {isLoading ? (
        <h2>New users Loading...</h2>
      ) : newUsers.length > 0 ? (
        newUsers.map((user: UserType) => (
          <div
            onClick={() => navigate(`/profile/${user.username}`)}
            key={user.id}
            className="flex gap-2 items-center mt-4 cursor-pointer"
          >
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={user.avatar || "/noAvatar.png"}
            />
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                {user.fullname}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                @{user.username}
              </p>
            </div>
          </div>
        ))
      ) : (
        <h2 className="text-center mt-6 text-gray-400">
          Hələ heçbir istifadəçi tapılmadı :(
        </h2>
      )}
    </div>
  );
};

export default Discover;
