import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full min-h-screen">
      <h1 className="text-2xl text-gray-400 font-bold">Səhifə tapılmadı!</h1>
      <Link
        to={"/"}
        className="bg-blue-400 text-white py-2 px-5 rounded-lg hover:bg-blue-500"
      >
        Ana Səhifə
      </Link>
    </div>
  );
};

export default NotFound;
