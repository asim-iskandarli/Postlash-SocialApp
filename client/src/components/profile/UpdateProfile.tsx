import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useMutation } from "@tanstack/react-query";
import { fetchUpdateProfile } from "../../api";
import { updateProfile } from "../../redux/auth/authSlice";
import { updateUserProfile } from "../../redux/user/userSlice";
import LoadSpinner from "../loaders/LoadSpinner";

function UpdateProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<{
    biography: string;
    birthday: string | null;
  }>({
    biography: "",
    birthday: null,
  });
  const [newAvatar, setNewAvatar] = useState<File | null>(null);

  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAppSelector((state) => state.auth);

  const updateProfileMutation = useMutation({
    mutationKey: ["user/update"],
    mutationFn: fetchUpdateProfile,
    onSuccess: (data) => {
      dispatch(
        updateProfile({
          biography: userData.biography,
          birthday: userData.birthday,
          avatar: data.imageUrl,
        })
      );
      dispatch(
        updateUserProfile({
          biography: userData.biography,
          birthday: userData.birthday,
          avatar: data.imageUrl,
          userId: user?.id,
        })
      );
      handleClose();
    },
  });

  useEffect(() => {
    if (user) {
      setUserData({
        biography: user?.biography || "",
        birthday: user?.birthday || null,
      });
    }
  }, [user, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    if (isOpen) {
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";
    } else {
      document.body.style.position = "";
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.position = "";
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setUserData({ biography: "", birthday: null });
    setNewAvatar(null);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleOpen();
    if (e.target.files && e.target.files[0]) {
      setNewAvatar(e.target.files[0]);
    }
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !newAvatar &&
      userData.biography === user?.biography &&
      userData.birthday === user?.birthday
    ) {
      return;
    }
    if (user?.id) {
      updateProfileMutation.mutate({
        userId: user?.id,
        userData: {
          ...userData,
          avatar: newAvatar,
        },
      });
    }
  };

  return (
    <div className="">
      {/* User avatar */}

      <button
        onClick={handleOpen}
        className="bg-sky-400 py-2 px-4 text-white rounded-md hover:bg-sky-500 duration-300"
      >
        Redaktə et
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-30 bg-gray-200">
          <div
            className="bg-white dark:bg-gray-700 w-[30rem] mx-4 sm:mx-0 p-6 md:p-8 rounded-2xl shadow-2xl relative"
            ref={modalRef}
          >
            {/* Bağlama düyməsi */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Redaktə et
            </h2>

            {/* Profil şəklini dəyişmək */}
            <div className="flex justify-center my-6">
              <label htmlFor="image-upload" className="cursor-pointer relative">
                <img
                  className="w-32 h-32 rounded-full"
                  src={
                    newAvatar
                      ? URL.createObjectURL(newAvatar)
                      : user?.avatar || "/noAvatar.png"
                  }
                />
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-gray-600 dark:text-gray-200">
                  Bioqrafiya
                </label>
                <input
                  type="text"
                  name="biography"
                  value={userData.biography || ""}
                  onChange={handleChangeInput}
                  placeholder="Bioqrafiya"
                  className="w-full mt-1 h-10 p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500"
                />
              </div>
              <div>
                <label className="text-gray-600 dark:text-gray-200">
                  Doğum tarixi
                </label>
                <input
                  name="birthday"
                  type="date"
                  value={
                    userData.birthday ? userData.birthday.split("T")[0] : ""
                  }
                  onChange={handleChangeInput}
                  className="w-full mt-1 h-10 p-3  bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:gray-400"
                />
              </div>

              {/* Düymələr */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-300"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="w-28 flex items-center justify-center bg-sky-400 text-white rounded-lg shadow hover:bg-sky-500 hover:scale-105 transition-all"
                >
                  {updateProfileMutation.isPending ? (
                    <LoadSpinner />
                  ) : (
                    "Yadda saxla"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateProfile;
