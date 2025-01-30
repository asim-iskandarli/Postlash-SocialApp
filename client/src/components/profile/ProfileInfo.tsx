import FollowButton from "../user/FollowButton";
import { useAppSelector } from "../../redux/hooks";
import UpdateProfile from "./UpdateProfile";
import { LuSend } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { UserType } from "../../types";
import FollowList from "../user/FollowList";

const ProfileInfo = ({ userProfile }: { userProfile: UserType }) => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <section className="w-full p-4 rounded-lg mb-4 flex md:gap-12 gap-6">
      <div className="flex-shrink-0">
        <img
          src={userProfile.avatar || "/noAvatar.png"}
          alt="avatar"
          className={`w-20 h-20 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border-2 ${
            userProfile.avatar && "border-sky-300"
          }`}
        />
      </div>
      <div className="flex flex-col w-full gap-4">
        <div className="mb-5">
          <div className="flex justify-between">
            <div>
              <h1 className="text-md lg:text-2xl text-gray-800 font-semibold dark:text-gray-200">
                {userProfile?.fullname}
              </h1>
              <p className="font-semibold text-xs lg:text-md text-gray-400 dark:text-gray-300">
                @{userProfile?.username}
              </p>
            </div>
            {user?.username === userProfile.username ? (
              <UpdateProfile />
            ) : (
              <div className="flex  flex-col md:flex-row gap-2">
                <button
                  onClick={() => navigate(`/messages/${userProfile.id}`)}
                  className="flex items-center gap-2 bg-sky-400 hover:bg-sky-500 duration-300 text-white h-10 px-5 rounded-md"
                >
                  <LuSend size={16} />
                  Mesaj
                </button>
                <FollowButton userId={userProfile.id} />
              </div>
            )}
          </div>
          {userProfile.biography && (
            <p className="mt-5 dark:text-gray-200 text-xs lg:text-base">
              {userProfile.biography}
            </p>
          )}
        </div>

        <div className="flex lg:flex-row flex-col gap-10">
          {/* Info */}
          <div className="flex gap-5 md:gap-10">
            <div>
              <p className="text-center font-bold md:text-xl text-sm text-gray-800 dark:text-gray-200">
                {userProfile._count?.posts || 0}
              </p>
              <h2 className="text-gray-500 font-semibold md:text-sm text-xs dark:text-gray-300">
                Paylaşımlar
              </h2>
            </div>
            {/* Followers */}
            <FollowList
              count={userProfile._count?.followers}
              type="followers"
              userId={userProfile.id}
            />
            {/* Followings */}
            <FollowList
              count={userProfile._count?.followings}
              type="followings"
              userId={userProfile.id}
            />
          </div>
          {/* Buttons */}
          {user?.username !== userProfile.username && (
            <div className="flex gap-2">
              {/* <button className="bg-red-400 hover:bg-red-500 duration-300 text-white py-2 px-6 rounded-lg ">
                Blokla
              </button> */}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileInfo;
