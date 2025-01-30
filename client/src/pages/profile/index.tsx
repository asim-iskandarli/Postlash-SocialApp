import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useParams } from "react-router-dom";
import Post from "../../components/post/Post";
import ProfileInfo from "../../components/profile/ProfileInfo";
import { useMutation } from "@tanstack/react-query";
import { getUser } from "../../redux/user/userSlice";
import ProfileInfoSkeletion from "../../components/skeletons/ProfileInfoSkeletion";
import PostSkeleton from "../../components/skeletons/PostSkeletion";
import { getProfile } from "../../api";
import { UserType } from "../../types";
import { Helmet } from "react-helmet-async";

const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { users } = useAppSelector((state) => state.user);
  const { username } = useParams();
  const dispatch = useAppDispatch();

  const [userProfile, setUserProfile] = useState<any>({
    id: "",
    fullname: "",
    username: "",
    posts: [],
    _count: {
      followers: 0,
      followings: 0,
      posts: 0,
    },
  });

  const getUserMutation = useMutation({
    mutationKey: ["user/get"],
    mutationFn: getProfile,
    onSuccess: (data) => {
      dispatch(getUser(data));
    },
  });

  useEffect(() => {
    if (user) {
      if (username) {
        if (!users.find((p: UserType) => p.username === username)) {
          getUserMutation.mutate(username);
        } else {
          setUserProfile(users.find((p: UserType) => p.username === username));
        }
      } else {
        if (!users.find((p: UserType) => p.username === user.username)) {
          getUserMutation.mutate(user.username);
        } else {
          setUserProfile(
            users.find((p: UserType) => p.username === user.username)
          );
        }
      }
    }
  }, [dispatch, users, username, user]);

  return (
    <div className="flex flex-col pt-14 md:pt-20 md:w-5/6 w-full lg:w-4/6 m-auto min-h-screen">
      <Helmet>
        <title>
          {import.meta.env.VITE_APP_NAME} | {userProfile.username || "Profil"}
        </title>
      </Helmet>
      {/* TOP */}
      <div className="flex">
        {/* PROFILE INFO */}
        {getUserMutation.isPending ? (
          <ProfileInfoSkeletion />
        ) : (
          <ProfileInfo userProfile={userProfile} />
        )}
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center my-10">
        <div className="lg:w-4/6 md:w-5/6 w-full md:mx-0 mx-5 flex flex-col gap-4">
          {getUserMutation.isPending ? (
            <PostSkeleton />
          ) : userProfile.posts?.length > 0 ? (
            userProfile.posts.map((post: any) => (
              <Post key={post.id} post={post} />
            ))
          ) : (
            <div className="mt-10">
              <h2 className="text-center text-xl font-semibold text-gray-400">
                Hələ heçbir paylaşım yoxdur.
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
