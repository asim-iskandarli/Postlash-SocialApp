import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updatePost } from "../../redux/post/postSlice";
import { useMutation } from "@tanstack/react-query";
import { updateUserPost } from "../../redux/user/userSlice";
import { BiSolidLike } from "react-icons/bi";
import { toggleLike } from "../../api";
import { LikeType, PostType } from "../../types";

const LikeButton = ({ post }: { post: PostType }) => {
  const { user } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const [isLiked, setIsLiked] = useState(
    user?.id
      ? post.likes.some((like: LikeType) => like.userId === user?.id)
      : false
  );

  const likeMutation = useMutation({
    mutationKey: ["post/like"],
    mutationFn: toggleLike,
  });

  const handleClickButton = () => {
    likeMutation.mutate(post.id);

    let newPost: PostType = { ...post };

    if (user?.id && Array.isArray(newPost.likes)) {
      const userLiked = newPost.likes.some(
        (like: LikeType) => like.userId === user?.id
      );
      if (userLiked) {
        newPost.likes = newPost.likes.filter(
          (like: LikeType) => like.userId !== user?.id
        );
      } else {
        newPost.likes = [...newPost.likes, { userId: user.id }];
      }
    }
    dispatch(updatePost(newPost));
    dispatch(updateUserPost(newPost));

    setIsLiked((prev: boolean) => !prev);
  };

  return (
    <div className="">
      <button
        onClick={handleClickButton}
        className={`py-2 md:px-4 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 duration-300
          ${
            isLiked
              ? " text-sky-500"
              : "text-gray-500 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400"
          }
          `}
      >
        <div className="flex gap-2 items-center font-semibold text-xs md:text-sm">
          <BiSolidLike
            className={`material-icons text-xl ${
              isLiked ? "text-sky-500" : "text-gray-400 duration-300"
            }`}
            size={18}
          />
          Bəyən
        </div>
      </button>
    </div>
  );
};

export default LikeButton;
