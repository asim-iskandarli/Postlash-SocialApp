import { ChangeEvent, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { UserType } from "../../types";
import FollowButton from "../../components/user/FollowButton";

const SearchPage = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

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
    navigate(`/profile/${username}`);
  };

  return (
    <div className="w-full min-h-screen pt-20 flex flex-col items-center">
      <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 shadow-md p-2">
        <div className="flex items-center mx-4 bg-gray-50 dark:bg-gray-700 p-2 rounded-3xl">
          <input
            type="text"
            value={searchText}
            onChange={handleChangeInput}
            placeholder="Axtarış edin..."
            className="flex-grow p-2 focus:outline-none rounded-lg text-gray-700 dark:text-gray-300 bg-transparent"
          />

          <IoIosSearch className="text-gray-400 dark:text-gray-300" size={24} />
        </div>

        <div className=" w-full mt-2 overflow-y-auto h-[65vh]">
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
                    <div>
                      <h2 className="text-gray-600 dark:text-gray-200">
                        {user.fullname}
                      </h2>
                      <p className="font-semibold dark:text-gray-300">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  <FollowButton userId={user.id} small={true} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6">
              <h2 className="dark:text-gray-300 text-center text-gray-500">
                Axtarış edin və kəşf edin!
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
