import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { GoHome } from "react-icons/go";
import { CiBookmark } from "react-icons/ci";

const Sidebar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <div className="h-full pt-20 pb-3 fixed top-0 pb-15 w-[19rem]">
      <div className="h-full bg-white dark:bg-gray-800 rounded-lg">
        <div className="p-2 border-b border-gray-100 dark:border-gray-700">
          <div
            className="flex gap-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer w-full p-4 rounded-lg duration-300"
            onClick={() => navigate(`/profile`)}
          >
            <img
              src={user?.avatar || "/noAvatar.png"}
              alt="Profil Şəkli"
              className="w-12 h-12 rounded-full bg-white object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold dark:text-gray-300">
                {user?.fullname || "User"}
              </h3>
              <p className="text-sm text-gray-400">
                @{user?.username || "user"}
              </p>
            </div>
          </div>
        </div>

        {/* Nəviqasiya */}
        <nav className="flex-grow p-2">
          <ul className="">
            <li>
              <Link
                to="/"
                className="flex items-center p-4 gap-2 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
              >
                <GoHome size={22} />
                Ana Səhifə
              </Link>
            </li>

            <li>
              <Link
                to="/bookmarks"
                className="flex items-center p-4 gap-2 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
              >
                <CiBookmark size={22} />
                Yadda saxlanılanlar
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
