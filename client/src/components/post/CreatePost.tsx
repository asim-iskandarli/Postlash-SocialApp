import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createPost } from "../../api";
import { addPost } from "../../redux/post/postSlice";
import { addPostUser } from "../../redux/user/userSlice";

function CreatePostModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const modalRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const createPostMutation = useMutation({
    mutationKey: ["post/create"],
    mutationFn: createPost,
    onSuccess: (data) => {
      dispatch(addPost(data));
      dispatch(addPostUser(data));
    },
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
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";
    } else {
      document.body.style.position = "";
      document.body.style.overflowY = "scroll";
    }

    return () => {
      document.body.style.position = "";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setPostContent("");
    setImages([]);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleOpen();
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", postContent);
    images.forEach((image: File) => {
      formData.append("media", image);
    });
    createPostMutation.mutate(formData);
    handleClose();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex flex-col gap-4 items-center">
      {/* User avatar */}
      <div className="flex w-full items-center gap-2">
        <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden">
          <Link to={`/profile/${user?.username}`}>
            <img
              className="w-full h-full object-cover"
              src={user?.avatar || "/noAvatar.png"}
              alt="avatar"
            />
          </Link>
        </div>
        <button
          onClick={handleOpen}
          className="bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300  font-semibold h-10 text-start pl-8 w-full rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          Yeni post paylaş
        </button>
      </div>
      {/* BUTTONS */}
      <div className="flex gap-8">
        {/* PHOTO BUTTON */}
        <div className="flex gap-2 items-center">
          <label
            htmlFor="image-upload"
            className="flex items-center px-4 py-1 bg-blue-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-blue-200 dark:hover:bg-gray-600 duration-300 transition-all"
          >
            <FaImage
              className="material-icons text-2xl text-sky-400"
              size={18}
            />
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <p className="font-semibold text-gray-500 dark:text-gray-300 ">
            Şəkil
          </p>
        </div>
        {/* VIDEO BUTTON */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="image-upload"
            className="flex items-center px-4 py-1  bg-green-100 dark:bg-gray-700 text-white rounded-lg cursor-pointer hover:bg-green-200 dark:hover:bg-gray-600 duration-300 transition-all"
          >
            <FaVideo
              className="material-icons text-2xl text-green-400"
              size={20}
            />
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <p className="font-semibold text-gray-500 dark:text-gray-300 ">
            Video
          </p>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-30 bg-gray-200">
          <div
            className="bg-white dark:bg-gray-700 w-full sm:mx-0 mx-4  max-w-lg p-6 md:p-8 rounded-2xl shadow-2xl relative"
            ref={modalRef}
          >
            {/* Bağlama düyməsi */}
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

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Yeni Post Yarat
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Post content */}
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Post məzmunu..."
                className="w-full h-32 p-3 dark:bg-gray-600 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              ></textarea>

              {/* Buttons */}
              <div className="flex justify-center gap-2">
                {/* Photo */}
                <div className="flex flex-col items-center space-y-3">
                  <label
                    htmlFor="image-upload"
                    className="flex items-center px-4 py-1  bg-blue-100 dark:bg-gray-600 text-white rounded-lg cursor-pointer hover:bg-blue-200 duration-300 transition-all"
                  >
                    <FaImage
                      className="material-icons text-2xl text-sky-400"
                      size={18}
                    />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                {/* Video */}
                <div className="flex flex-col items-center space-y-3">
                  <label
                    htmlFor="image-upload"
                    className="flex items-center px-4 py-1  bg-green-100 dark:bg-gray-600 text-white rounded-lg cursor-pointer hover:bg-green-200 duration-300 transition-all"
                  >
                    <FaVideo
                      className="material-icons text-2xl text-green-400"
                      size={20}
                    />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              {/* Selected photos */}
              {images.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h3 className="text-lg font-medium text-gray-700">
                    Seçilmiş Şəkillər
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative group bg-gray-100 rounded-lg overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Selected ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
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
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-300 hover:dark:bg-gray-500"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-400 text-white rounded-lg shadow hover:bg-sky-500 hover:scale-105 transition-all"
                >
                  Paylaş
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatePostModal;
