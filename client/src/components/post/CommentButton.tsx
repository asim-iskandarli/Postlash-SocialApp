import { FormEvent, useEffect, useRef, useState } from "react";
import { BiSolidComment } from "react-icons/bi";
import { Link } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createCommentToPost, getComments } from "../../api";
import { CommentType, PostType } from "../../types";
import LoadSpinner from "../loaders/LoadSpinner";
// import dayjs from "dayjs";
import { useAppSelector } from "../../redux/hooks";

const CommentButton = ({ post }: { post: PostType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLInputElement | null>(null);
  const scrollPosition = useRef(0);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const { user } = useAppSelector((state) => state.auth);

  const { data, refetch } = useQuery({
    queryKey: ["posts/getComments", post?.id, isOpen],
    queryFn: () => getComments(post?.id),
    enabled: !!post.id,
  });

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

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
    if (data) {
      setComments(data);
    }
  }, [data]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
  };

  const createCommentMutation = useMutation({
    mutationKey: ["comment/createComment"],
    mutationFn: createCommentToPost,
    onSuccess: (data) => {
      setComments((prev): CommentType[] => [...prev, data]);
      setContent("");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!content || createCommentMutation.isPending) {
      return;
    }

    createCommentMutation.mutate({ content, postId: post.id });
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className={`py-2 md:px-4 px-2 rounded-lg hover:bg-gray-100 text-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 duration-300`}
      >
        <div
          className={`flex gap-2 items-center font-semibold text-xs md:text-sm`}
        >
          <BiSolidComment
            className={`material-icons text-gray-400 duration-300`}
            size={16}
          />
          Şərh bildir
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-30 bg-gray-200">
          <div
            className="bg-white mx-4 sm:mx-0 dark:bg-gray-700 w-full  max-w-lg p-6 rounded-2xl shadow-2xl relative"
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
                Şərh bildir
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <img
                src={post.user.avatar || "/noAvatar.png"}
                className="w-12 h-12 object-cover rounded-full"
                alt="avatar"
              />
              <div>
                <h4 className="text-gray-800 dark:text-gray-200 font-semibold">
                  {post.user.fullname}
                </h4>
                <span className="text-gray-500 dark:text-gray-300 text-md">
                  @{post.user.username}
                </span>
              </div>
            </div>
            {post.content && (
              <p className="mt-2 dark:text-gray-200">{post.content}</p>
            )}
            {/* Şərhlər */}
            <div className="mt-5">
              <h6 className="text-gray-500 dark:text-gray-200">Şərhlər</h6>
              <div className="max-h-72 overflow-y-auto">
                {comments.length > 0 ? (
                  comments.map((comment: CommentType) => (
                    <div key={comment.id} className="flex gap-2 mt-2">
                      <Link
                        to={`/profile/${comment.user?.username}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={comment.user?.avatar || "/noAvatar.png"}
                          className="w-10 h-10 object-cover rounded-full"
                          alt="avatar"
                        />
                      </Link>
                      <div className="bg-gray-100 px-4 py-1 rounded-xl dark:bg-gray-600">
                        <Link
                          to={`/profile/${comment.user?.username}`}
                          className="font-semibold text-gray-700 dark:text-gray-200"
                        >
                          {comment.user?.username}
                        </Link>
                        <p className="text-gray-600 dark:text-gray-300">
                          {comment.content}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {/* {dayjs(comment?.createdAt).fromNow()} */}
                        </span>
                      </div>
                      {/* <button className="text-gray-200">Cavabla</button> */}
                    </div>
                  ))
                ) : (
                  <h2 className="mt-2 dark:text-gray-400">
                    Hələ heç bir şərh yazılmayıb
                  </h2>
                )}
              </div>

              <div className="flex gap-2 mt-8 border-t border-t-gray-200 dark:border-t-gray-600 p-2">
                <img
                  src={user?.avatar || "/noAvatar.png"}
                  className="w-10 h-10 object-cover rounded-full"
                  alt="avatar"
                />
                <div className="w-full flex-1">
                  <form
                    onSubmit={handleSubmit}
                    className="flex gap-2 w-full flex-1 items-end"
                  >
                    <textarea
                      placeholder="Şərh bildir"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="bg-gray-100 text-gray-700 flex-1 dark:bg-gray-600 dark:text-gray-200 dark:placeholder:text-gray-300 w-full p-3 pl-2 rounded-md outline-none resize-none"
                    />
                    <button
                      disabled={createCommentMutation.isPending}
                      className=" text-sky-400 hover:bg-gray-100 dark:hover:bg-gray-500 w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      {createCommentMutation.isPending ? (
                        <LoadSpinner />
                      ) : (
                        <IoSend size={22} />
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentButton;
