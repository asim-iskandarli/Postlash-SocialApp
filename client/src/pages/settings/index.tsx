import { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { Helmet } from "react-helmet-async";

const SettingsPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [userData, setUserData] = useState({
    email: user?.email,
    username: user?.username,
    oldPassword: "",
    newPassword: "",
  });
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Helmet>
        <title>{import.meta.env.VITE_APP_NAME} | Tənzimləmələr</title>
      </Helmet>
      <div className="dark:bg-gray-800 w-full mx-2 lg:w-1/3  md:w-2/3 bg-white p-4 rounded-md shadow-lg mt-16">
        <h2 className="text-xl font-semibold my-4 text-gray-500 dark:text-gray-300 text-center">
          Tənzimləmələr
        </h2>
        <form className="px-4 flex flex-col gap-2 mb-4">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              E-poçt
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChangeInput}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-200"
              disabled
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              İstifadəçi adı
            </label>
            <input
              type="username"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChangeInput}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-200"
              placeholder="İstifadəçi adınızı daxil edin"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              Yeni şifrə
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={userData.newPassword}
              onChange={handleChangeInput}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-200"
              placeholder="Şifrənizi daxil edin"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              Əvvəlki şifrə
            </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={userData.oldPassword}
              onChange={handleChangeInput}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-200"
              placeholder="Şifrənizi daxil edin"
            />
          </div>
          <button className="bg-green-400 hover:bg-green-500 duration-300 p-2 rounded-md text-white">
            Yadda saxla
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
