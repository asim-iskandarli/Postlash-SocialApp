import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { IoCamera } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { createStory } from "../../../api";
import { addStory } from "../../../redux/stories/storiesSlice";
import { useAppDispatch } from "../../../redux/hooks";
import { toast } from "react-toastify";

function CreateStoryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  const createStoryMutation = useMutation({
    mutationKey: ["story/create"],
    mutationFn: createStory,
    onSuccess: (data) => {
      dispatch(addStory(data));
      toast.success("Hekayə uğurla əlavə edildi.");
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
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsOpen(false);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleOpen();
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      alert("Zəhmət olmasa şəkil faylı seçin.");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (image) {
      const formData = new FormData();
      formData.append("media", image);

      createStoryMutation.mutate(formData);
      handleClose();
    }
  };

  return (
    <div className="flex-1">
      <label
        htmlFor="upload-story"
        className="rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400 duration-300 cursor-pointer border-2 border-dashed border-gray-300 bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:border-gray-500 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center"
      >
        <IoCamera size={24} />
        <div className="flex gap-8">
          {/* PHOTO BUTTON */}
          <div className="flex gap-2 items-center">
            <input
              ref={fileInputRef}
              id="upload-story"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </label>

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
              Yeni hekayə paylaş
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {image && (
                <div className="mt-4 space-y-3">
                  <div className="relative group bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="story"
                      className="w-full h-60 object-cover"
                    />
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

export default CreateStoryModal;
