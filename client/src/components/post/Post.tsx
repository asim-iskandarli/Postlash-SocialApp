import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import ShareButton from "./ShareButton";
import BookmarkButton from "./BookmarkButton";
import { FiDelete } from "react-icons/fi";
import { PostType } from "../../types";
import { useMutation } from "@tanstack/react-query";
import { deletePost } from "../../api";
import { postDelete } from "../../redux/post/postSlice";
import { toast } from "react-toastify";

const Post = ({ post }: { post: PostType }) => {
  const dispatch = useAppDispatch();
  const deletePostMutation = useMutation({
    mutationKey: ["post/delete"],
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post uğurla silindi.");
    },
  });

  const { user } = useAppSelector((state) => state.auth);
  const handleDeletePost = (postId: string) => {
    deletePostMutation.mutate(postId);
    dispatch(postDelete(postId));
  };

  return (
    <div
      key={post.id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-3 hover:shadow-lg duration-300"
    >
      <div>
        {/* HEADER */}
        <div className="flex p-3 justify-between items-center">
          <div className="flex gap-3">
            <Link to={`/profile/${post.user.username}`}>
              <img
                src={post.user.avatar || "/noAvatar.png"}
                className="w-12 h-12 rounded-full cursor-pointer object-cover"
              />
            </Link>
            <Link
              to={`/profile/${post.user.username}`}
              className="cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {post.user.fullname}
              </h3>
              <p className="text-xs text-gray-400">@{post.user.username}</p>
            </Link>
          </div>
          {post.user.id === user?.id && (
            <button
              onClick={() => handleDeletePost(post.id)}
              className="text-red-400 cursor-pointer font-bold"
              title="Sil"
            >
              <FiDelete size={18} className="text-red-400" />
            </button>
          )}
        </div>
        {/* BODY */}
        <div className="">
          <p className="text-gray-600 mb-2 px-4 dark:text-gray-200">
            {post.content}
          </p>
          {post.media && post.media?.length > 0 && (
            <div
              className={`grid ${
                post.media?.length === 1
                  ? "grid-cols-1"
                  : post.media?.length === 2
                  ? "grid-cols-2"
                  : post.media?.length === 3
                  ? "grid-cols-3"
                  : "grid-cols-2"
              } gap-1`}
            >
              {post.media?.map((media: string) => (
                <img
                  key={media}
                  src={media}
                  alt={"Post"}
                  className={`w-full ${
                    post.media?.length === 1 ? "h-96" : "h-72"
                  } object-cover cursor-pointer`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* FOOTER */}
      <div className="p-2">
        {
          <div className="flex">
            <p className="px-4 text-md text-gray-400 mb-2">
              {post.likes.length} Bəyəni
            </p>
            <p className="px-4 text-md text-gray-400 mb-2">
              {post._count?.comments || 0} Rəy
            </p>
          </div>
        }
        {/* BUTTONS */}
        <div className="flex items-center justify-between p-2">
          <LikeButton post={post} />
          <CommentButton post={post} />
          <ShareButton />
          <BookmarkButton post={post} />
        </div>
      </div>
    </div>
  );
};

export default Post;
