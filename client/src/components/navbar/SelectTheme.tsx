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
    <div className="pl-5 py-4" onClick={toggleDarkMode}>
      {isDarkMode ? (
        <p className="flex items-center gap-2">
          <GoSun size={18} /> Light Mode
        </p>
      ) : (
        <p className="flex items-center gap-2">
          <IoMoonOutline size={18} /> Dark Mode
        </p>
      )}
    </div>
  );
};

export default Theme;
