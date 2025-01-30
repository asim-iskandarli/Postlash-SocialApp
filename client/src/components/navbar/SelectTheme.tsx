import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setDarkMode } from "../../redux/theme/themeSlice";
import { GoSun } from "react-icons/go";
import { IoMoonOutline } from "react-icons/io5";

const Theme = () => {
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

  const toggleDarkMode = () => {
    dispatch(setDarkMode(!isDarkMode));
  };

  return (
    <div className="p-1" onClick={toggleDarkMode}>
      {isDarkMode ? (
        <p className="flex items-center gap-2 text-gray-200 cursor-pointer">
          <GoSun size={18} />{" "}
          <span className="md:block hidden">İşıq rejimi</span>
        </p>
      ) : (
        <p className="flex items-center gap-2 cursor-pointer">
          <IoMoonOutline size={18} />
          <span className="md:block hidden">Qaranlıq rejim</span>
        </p>
      )}
    </div>
  );
};

export default Theme;
