import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { setUser } from "../../redux/auth/authSlice";
import LoadSpinner from "../../components/loaders/LoadSpinner";
import { fetchSignin } from "../../api";
import { SigninType } from "../../types";
import { validateSignin } from "../../utils/clientValidation";

function SigninPage() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const [userData, setUserData] = useState<SigninType>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const mutation = useMutation({
    mutationFn: fetchSignin,
    onSuccess: (data) => {
      dispatch(setUser(data));
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "Xəta baş verdi");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateSignin(userData);
    if (errors.length > 0) {
      return setError(errors[0]);
    }

    mutation.mutate(userData);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev: SigninType) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-[30rem] mx-4 p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-gray-300">
          Daxil ol
        </h2>
        <form onSubmit={handleSubmit} className="px-4">
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
              className="w-full px-4 h-10 mt-2 placeholder:text-gray-500 text-gray-500 bg-gray-100 outline-none rounded-md dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-100"
              placeholder="E-poçtunuzu daxil edin"
              autoComplete="email"
            />
          </div>
          <div className="mb-6">
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
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="flex justify-center items-center w-full h-10 bg-sky-400 text-white rounded-md hover:bg-sky-500"
          >
            {mutation.isPending ? <LoadSpinner /> : "Daxil ol"}
          </button>
          {error && (
            <h2 className="p-1 bg-red-100 rounded-md text-center mt-4 text-red-600 font-semibold">
              {error}
            </h2>
          )}
        </form>
        <p className="mt-4 text-center dark:text-gray-200">
          Hesabınız yoxdur? İndi{" "}
          <Link
            to="/signup"
            className="text-sky-500 hover:underline font-semibold"
          >
            Qeydiyyatdan keçin
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SigninPage;
