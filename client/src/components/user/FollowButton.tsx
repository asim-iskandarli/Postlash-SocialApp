import { useMutation } from "@tanstack/react-query";
import api from "../../api";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { userFollow, userUnfollow } from "../../redux/user/userSlice";
import { useEffect, useState } from "react";
import { follow, unfollow } from "../../redux/auth/authSlice";
import { FollowType } from "../../types";

const fetchFollow = async (userId: string) => {
  await api.post(`/user/${userId}/follow`);
};

const FollowButton = ({
  userId,
  small,
}: {
  userId: string;
  small?: boolean;
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    if (
      user?.followings.some(
        (follow: FollowType) => follow.followerId === userId
      )
    ) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
  }, [user?.followings, userId]);

  const dispatch = useAppDispatch();

  const followMutation = useMutation({
    mutationKey: ["user/follow"],
    mutationFn: fetchFollow,
  });

  const handleFollow = () => {
    if (user) {
      followMutation.mutate(userId);
      setIsFollowed((prev) => !prev);
      if (isFollowed) {
        dispatch(unfollow(userId));
        dispatch(userUnfollow({ userId, currentId: user?.id }));
      } else {
        dispatch(follow(userId));
        dispatch(userFollow({ userId, currentId: user?.id }));
      }
    }
  };

  if (userId === user?.id) {
    return;
  }

  return (
    <>
      <button
        onClick={handleFollow}
        className={`border border-sky-400 hover:bg-sky-400 text-sky-400 text-sm hover:text-white font-semibold rounded-md duration-300
          ${small ? "h-9 w-28 text-xs" : "h-10 w-32"}
          ${isFollowed && "bg-sky-400 text-white hover:bg-sky-500"}
          `}
      >
        {isFollowed ? "İzləmədən çıxar" : "İzləyin"}
      </button>
    </>
  );
};

export default FollowButton;
