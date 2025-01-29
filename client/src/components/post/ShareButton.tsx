import { FaShareAlt } from "react-icons/fa";

const ShareButton = () => {
  const handleClickButton = () => {};

  return (
    <button
      onClick={handleClickButton}
      className={`py-2 md:px-4 px-2 rounded-lg hover:bg-gray-100 duration-300 text-gray-500 dark:text-gray-200 dark:hover:bg-gray-600`}
    >
      <div
        className={`flex gap-2 items-center font-semibold text-xs md:text-sm`}
      >
        <FaShareAlt
          className={`material-icons text-xl text-gray-400 duration-300`}
          size={16}
        />
        Paylaş
      </div>
    </button>
  );
};

export default ShareButton;
