import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { UserType } from "../../types";

const ActiveUsers = () => {
  const navigate = useNavigate();
  const { activeUsers } = useAppSelector((state) => state.user);

  return (
    <div className="bg-white dark:bg-gray-800 w-full max-h-96 overflow-y-auto rounded-lg shadow-sm p-4 mb-2">
      <h2 className="font-semibold text-gray-500 dark:text-gray-300">
        Aktiv istifadəçilər
      </h2>
      {activeUsers.length > 0 ? (
        activeUsers.map((user: UserType) => (
          <div
            onClick={() => navigate(`/profile/${user.username}`)}
            key={user.id}
            className="flex gap-2 items-center mt-4 cursor-pointer"
          >
            <div className="relative">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={user.avatar || "/noAvatar.png"}
              />
              <span className="absolute bottom-[1px] right-1 w-2 h-2 bg-green-500 rounded-full"></span>
            </div>
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
        <h2 className="text-center mt-6 text-gray-400 dark:text-gray-300">
          Hələ heçbir istifadəçi aktiv deyil.
        </h2>
      )}
    </div>
  );
};

export default ActiveUsers;
