import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Link } from "react-router-dom";
import { setIsOpenCreate } from "../../redux/post/postSlice";

function CreatePostButton() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleOpen = () => {
    dispatch(setIsOpenCreate(true));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex flex-col gap-4 items-center">
      {/* User avatar */}
      <div className="flex w-full items-center gap-2">
        <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden">
          <Link to={`/profile/${user?.username}`}>
            <img
              className="w-full h-full object-cover"
              src={user?.avatar || "/noAvatar.png"}
              alt="avatar"
            />
          </Link>
        </div>
        <button
          onClick={handleOpen}
          className="bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300  font-semibold h-10 text-start pl-8 w-full rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          Yeni post paylaş
        </button>
      </div>
    </div>
  );
}

export default CreatePostButton;
