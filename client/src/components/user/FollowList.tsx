import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserFollows } from "../../api";
import LoadSpinner from "../loaders/LoadSpinner";

const FollowList = ({
  userId,
  count,
  type,
}: {
  userId: string;
  count: number;
  type: "followers" | "followings";
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLInputElement | null>(null);
  const scrollPosition = useRef(0);
  const [followData, setFollowData] = useState<any>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["user/followers", userId, type],
    queryFn: () => getUserFollows(userId, type),
    enabled: !!isOpen,
  });

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
      scrollPosition.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflowY = "scroll";
      window.scrollTo(0, scrollPosition.current);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setFollowData(data);
      console.log(data);
    }
  }, [data, isOpen]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={handleOpen} className="cursor-pointer">
        <p className="text-center font-bold md:text-xl text-sm text-gray-800 dark:text-gray-200">
          {count || 0}
        </p>
        <h2 className="text-gray-500 font-semibold md:text-sm text-xs dark:text-gray-300">
          {type === "followers" ? "İzləyicilər" : "İzlənənlər"}
        </h2>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-30 bg-gray-200">
          <div
            className="bg-white mx-4 sm:mx-0 min-h-48 dark:bg-gray-700 w-full  max-w-lg p-6 rounded-2xl shadow-2xl relative"
            ref={modalRef}
          >
            <div>
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 duration-300"
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
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                {type === "followers" ? "İzləyicilər" : "İzlənənlər"}
              </h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="w-full h-20 flex items-center justify-center">
                  <LoadSpinner />
                </div>
              ) : followData.length > 0 ? (
                followData.map((follow: any) => {
                  const userData =
                    type === "followers" ? follow.following : follow.follower;
                  return (
                    <Link
                      key={follow.id}
                      to={`/profile/${userData.username}`}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 p-2 rounded-md duration-300"
                    >
                      <img
                        src={userData.avatar || "/noAvatar.png"}
                        className="w-12 h-12 object-cover rounded-full"
                        alt="avatar"
                      />
                      <div>
                        <h4 className="text-gray-700 dark:text-gray-200 font-semibold">
                          {userData.fullname}
                        </h4>
                        <span className="text-gray-500 dark:text-gray-300 text-md">
                          @{userData.username}
                        </span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <h2 className="dark:text-gray-400 text-center mt-10">
                  Hələ heç bir {type === "followers" ? "izləyici" : "izlənən"}{" "}
                  yoxdur
                </h2>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FollowList;
