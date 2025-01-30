import { Link, useLocation } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { RiNotification2Line } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setIsOpenCreate } from "../../redux/post/postSlice";

const NavbarMobile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const navItems = [
    { to: "/", icon: <GoHome size={20} />, key: "home" },
    { to: "/search", icon: <IoIosSearch size={20} />, key: "search" },
    {
      onClick: "handleClickCreateButton",
      icon: <FaPlus size={20} />,
      key: "create",
    },
    {
      to: "/notifications",
      icon: <RiNotification2Line size={20} />,
      key: "notifications",
    },
    {
      to: `/profile/${user?.username}`,
      icon: <IoPersonOutline size={20} />,
      key: "profile",
    },
  ];

  const handleClickCreateButton = () => {
    dispatch(setIsOpenCreate(true));
  };

  return (
    <div className="fixed md:hidden w-full bg-white dark:bg-gray-800 shadow-md border-t border-t-gray-100 dark:border-t-gray-700 bottom-0 left-0 h-12">
      <div className="w-full h-full flex items-center justify-between px-8">
        {navItems.map((item) => {
          if (item.to) {
            return (
              <Link
                key={item.key}
                to={item.to}
                className={`${
                  pathname === item.to
                    ? "text-gray-900 dark:text-gray-200"
                    : "text-gray-600 dark:text-gray-500"
                }`}
              >
                {item.icon}
              </Link>
            );
          } else {
            return (
              <div
                key={item.key}
                onClick={handleClickCreateButton}
                className="bg-sky-400 rounded-full text-white dark:text-gray-200 cursor-pointer p-2"
              >
                {item.icon}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default NavbarMobile;
