import { FaBookmark } from "react-icons/fa";
import { toggleBookmark } from "../../api";
import { useMutation } from "@tanstack/react-query";
import { BookmarkType, PostType } from "../../types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useState } from "react";
import { updatePost } from "../../redux/post/postSlice";
import { updateUserPost } from "../../redux/user/userSlice";

const BookmarkButton = ({ post }: { post: PostType }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [isBookmarked, setIsBookarked] = useState(
    user?.id
      ? post.bookmarks?.some((bookmark: any) => bookmark.userId === user?.id)
      : false
  );
  const dispatch = useAppDispatch();

  const bookmarkMutation = useMutation({
    mutationKey: ["post/bookmark"],
    mutationFn: toggleBookmark,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleClickButton = () => {
    bookmarkMutation.mutate(post.id);

    let newPost: PostType = { ...post };

    if (user?.id && Array.isArray(newPost.bookmarks)) {
      const userBookmarked = newPost.bookmarks.some(
        (bookmark: BookmarkType) => bookmark.userId === user?.id
      );
      if (userBookmarked) {
        newPost.bookmarks = newPost.bookmarks.filter(
          (bookmark: BookmarkType) => bookmark.userId !== user?.id
        );
      } else {
        newPost.bookmarks = [...newPost.bookmarks, { userId: user.id }];
      }
    }
    dispatch(updatePost(newPost));
    dispatch(updateUserPost(newPost));

    setIsBookarked((prev: boolean) => !prev);
  };

  return (
    <button
      onClick={handleClickButton}
      className={`py-2 md:px-4 px-2 rounded-lg text-gray-500 hover:bg-gray-100 duration-300 dark:text-gray-200 dark:hover:bg-gray-600`}
    >
      <div
        className={`flex gap-2 items-center font-semibold text-xs md:text-sm 
          ${isBookmarked ? "text-yellow-500" : "text-gray-500"}
          `}
      >
        <FaBookmark
          className={`material-icons text-xl duration-300`}
          size={16}
        />
        Saxla
      </div>
    </button>
  );
};

export default BookmarkButton;
