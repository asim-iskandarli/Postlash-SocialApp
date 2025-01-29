import { ChangeEvent, useEffect, useRef, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import FollowButton from "../user/FollowButton";
import { UserType } from "../../types";

const SearchBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    handleSearch(searchText);
  };

  const handleSearch = async (name: string) => {
    const res = await api.get("/user/search", {
      params: {
        name,
      },
    });
    if (res.data) {
      setUsers(res.data);
    }
  };

  const handleClickItem = (username: string) => {
    setSearchText("");
    setUsers([]);
    setShowDropdown(false);
    navigate(`/profile/${username}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !searchRef.current?.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex static lg:relative h-12 items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-3xl lg:w-96 w-64">
      <input
        type="text"
        value={searchText}
        onChange={handleChangeInput}
        placeholder="Axtarış edin..."
        className="flex-grow p-2 focus:outline-none rounded-lg text-gray-700 dark:text-gray-300 bg-transparent"
        onFocus={() => setShowDropdown(true)}
        ref={inputRef}
      />

      <IoIosSearch
        className="material-icons text-gray-400 dark:text-gray-300"
        size={24}
      />

      {showDropdown && (
        <div
          ref={searchRef}
          className="absolute left-1/2 -translate-x-1/2 top-14 lg:top-12 w-[95%] md:w-[75%] lg:w-full mt-2 bg-white dark:bg-gray-700 rounded-md shadow-xl"
        >
          {searchText && users.length > 0 ? (
            <ul className="p-2">
              {users.map((user: UserType) => (
                <li
                  onClick={() => handleClickItem(user.username)}
                  key={user.id}
                  className="px-4 py-4 rounded-md flex justify-between hover:bg-gray-100 dark:hover:bg-gray-600 font-medium cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={user.avatar || "/noAvatar.png"}
                    />
                    <p className="font-semibold dark:text-gray-300">
                      {user.username}
                    </p>
                  </div>
                  <FollowButton userId={user.id} small={true} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6">
              <h2 className="dark:text-gray-300">Axtarış edin və kəşf edin!</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
