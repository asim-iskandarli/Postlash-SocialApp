import { ImSpinner2 } from "react-icons/im";

const LoadSpinner = () => {
  return (
    <div className="w-5 h-5">
      <ImSpinner2 className="animate-spin text-blue-200" size={20} />
    </div>
  );
};

export default LoadSpinner;
