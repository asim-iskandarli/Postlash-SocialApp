import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import api from "../../api";
import { logout } from "../../redux/auth/authSlice";
import Theme from "./SelectTheme";
import { IoPersonOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { IoExitOutline } from "react-icons/io5";

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    dispatch(logout());
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Profil Button */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="flex items-center space-x-2 cursor-pointer select-none"
      >
        <img
          src={user?.avatar || "/noAvatar.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      </button>

      {/* Menyu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg"
          ref={menuRef}
        >
          <ul>
            <li className="" onClick={() => setIsOpen(false)}>
              <Link
                className="flex items-center gap-2 pl-5 py-4 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                to={"/profile"}
              >
                <IoPersonOutline size={18} />
                Profil
              </Link>
            </li>
            <li className="" onClick={() => setIsOpen(false)}>
              <div className="block dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <Theme />
              </div>
            </li>
            <li className="" onClick={() => setIsOpen(false)}>
              <Link
                to={"/settings"}
                className="flex items-center gap-2 pl-5 py-4 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <IoSettingsOutline size={18} />
                Tənzimləmələr
              </Link>
            </li>
            <li className="" onClick={handleLogout}>
              <h5 className="flex  items-center gap-2 pl-5 py-4 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <IoExitOutline size={18} />
                Çıxış
              </h5>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
