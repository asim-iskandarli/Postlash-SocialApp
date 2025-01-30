import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import LoadSpinner from "../../components/loaders/LoadSpinner";
import { fetchSignup } from "../../api";
import { setUser } from "../../redux/auth/authSlice";
import { SignupType } from "../../types";
import { validateSignup } from "../../utils/clientValidation";

function SignupPage() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const [userData, setUserData] = useState<SignupType>({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: fetchSignup,
    onSuccess: (data) => {
      dispatch(setUser(data));
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "Xəta baş verdi");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateSignup(userData);
    if (errors.length > 0) {
      return setError(errors[0]);
    }

    mutation.mutate(userData);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev: SignupType) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-[35rem] mx-4 p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-gray-300">
          Qeydiyyat
        </h2>
        <form onSubmit={handleSubmit} className="">
          <div className="grid grid-cols-2 gap-2">
            <div className="mb-4 col-span-2">
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
                className="w-full px-4 h-10 mt-2 placeholder:text-gray-500 text-gray-500 bg-gray-100 outline-none rounded-md dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-100"
                placeholder="E-poçtunuzu daxil edin"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                Ad, Soyad
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={userData.fullname}
                onChange={handleChangeInput}
                required
                className="w-full px-4 h-10 mt-2 placeholder:text-gray-500 text-gray-500 bg-gray-100 outline-none rounded-md dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-100"
                placeholder="Adınızı daxil edin"
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
                className="w-full px-4 h-10 mt-2 placeholder:text-gray-500 text-gray-500 bg-gray-100 outline-none rounded-md dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-100"
                placeholder="İstifadəçi adınızı daxil edin"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                Şifrə
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChangeInput}
                required
                className="w-full px-4 h-10 mt-2 placeholder:text-gray-500 text-gray-500 bg-gray-100 outline-none rounded-md dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-100"
                placeholder="Şifrənizi daxil edin"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                Şifrəni Təkrarlayın
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={userData.confirmPassword}
                name="confirmPassword"
                onChange={handleChangeInput}
                required
                className="w-full px-4 h-10 mt-2 placeholder:text-gray-500 text-gray-500 bg-gray-100 outline-none rounded-md dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-100"
                placeholder="Şifrənizi təkrarlayın"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex justify-center items-center w-full h-10 bg-green-500 text-white rounded-md hover:bg-green-600"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <LoadSpinner /> : "Qeydiyyatdan keçin"}
          </button>
          {error && (
            <h2 className="p-1 bg-red-50 rounded-lg text-center mt-4 text-red-400 font-medium">
              {error}
            </h2>
          )}
        </form>
        <p className="mt-4 text-center dark:text-gray-200">
          Hesabınız var?{" "}
          <Link
            to={"/signin"}
            className="text-sky-500 hover:underline font-semibold"
          >
            Daxil olun
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
