import { useEffect, useState } from "react";
import ProfileMenu from "./ProfileMenu";
import { Link } from "react-router-dom";
import SearchBar from "./Search";
import { GoHomeFill } from "react-icons/go";
import { BiSolidMessageAltDots } from "react-icons/bi";
import NotificationsMenu from "./NotificationsMenu";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Tabbar from "./Tabbar";
import Theme from "./SelectTheme";
import { IoExitOutline } from "react-icons/io5";
import api from "../../api";
import { logout } from "../../redux/auth/authSlice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    dispatch(logout());
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`fixed z-30 bg-white dark:bg-gray-800 top-0 left-0 w-full border-b border-gray-200 dark:border-gray-700 shadow-lg duration-500 ${
        isScrolled ? "p-1" : "p-2"
      }`}
    >
      <div className="container w-[90%] mx-auto flex justify-between items-center ">
        <div className="flex flex-1 gap-14 items-center">
          {/* Logo */}
          <Link to={"/"} className="text-sky-400 font-bold text-lg sm:text-xl">
            POSTLAŞ
          </Link>
          <SearchBar />
        </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 items-center">
          <Link
            to={"/"}
            className="text-gray-500  hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-500 w-9 h-9 flex justify-center items-center rounded-full duration-200 cursor-pointer select-none"
          >
            <GoHomeFill size={22} />
          </Link>
          <Link
            to="/messages"
            className="text-gray-500  hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-500 w-9 h-9 flex justify-center items-center rounded-full duration-200 cursor-pointer select-none"
          >
            <BiSolidMessageAltDots size={22} />
          </Link>
          <NotificationsMenu />
          <ProfileMenu />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-6">
          <Theme />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black dark:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile */}
      <Tabbar />
      {/* Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden  p-4 space-y-2">
          <Link
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            to="/"
            className="block text-black dark:text-gray-200 hover:text-gray-400"
          >
            Ana səhifə
          </Link>
          <Link
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            to="/messages"
            className="block text-black dark:text-gray-200 hover:text-gray-400"
          >
            Mesajlar
          </Link>
          <Link
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            to="/bookmarks"
            className="block text-black dark:text-gray-200 hover:text-gray-400"
          >
            Yadda saxlanılanlar
          </Link>
          {/* User Profile */}
          <div className="flex items-center justify-between mt-4">
            <Link
              to={`/profile/${user?.username}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-between space-x-2"
            >
              <div className="flex items-center gap-2">
                <img
                  src={user?.avatar || "/noAvatar.png"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-black dark:text-gray-200">
                  {user?.username}
                </span>
              </div>
            </Link>
            <button
              className="bg-gray-100 dark:bg-gray-700 py-2 px-3 rounded-md"
              onClick={handleLogout}
            >
              <div className="flex text-gray-600 items-center gap-2  dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <IoExitOutline size={18} />
              </div>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
