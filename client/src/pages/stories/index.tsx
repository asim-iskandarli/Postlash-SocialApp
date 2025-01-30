import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { Link, useNavigate, useParams } from "react-router-dom";
import { StoryType } from "../../types";

const StoriesPage = () => {
  const [story, setStory] = useState<StoryType | null>(null);
  const { storyId } = useParams();
  const { stories } = useAppSelector((state) => state.stories);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (storyId) {
      const currentStory = stories.find(
        (story: StoryType) => story.id === storyId
      );
      setStory(currentStory || null);
    }
  }, [storyId, stories]);

  useEffect(() => {
    if (!story) return;

    const duration = 5000;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev: number) => {
        if (prev + increment >= 100) {
          clearInterval(timer);
          navigate(-1);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [story, navigate]);

  if (!story) return;
  return (
    <div className="fixed w-full min-h-screen z-30 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full sm:w-3/4 md:w-2/4 bg-white dark:bg-gray-800 shadow-md justify-between rounded-md relative">
        <div className="flex items-center justify-between px-4 py-2 mt-1">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${story.user.username}`}>
              <img
                src={story.user.avatar || "/noAvatar.png"}
                className="w-16 h-16 rounded-full  "
                alt="avatar"
              />
            </Link>
            <Link to={`/profile/${story.user.username}`}>
              <h4 className="text-gray-600 dark:text-gray-200 font-semibold">
                {story.user.fullname}
              </h4>
              <p className="text-gray-400">@{story.user.username}</p>
            </Link>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-500 duration-300"
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
        </div>
        <div className="w-full h-[80vh]">
          <img
            src={story.media}
            className="w-full h-full object-cover"
            alt="story"
          />
        </div>
        <div className="absolute top-1 left-0 w-full h-1 bg-sky-200 bg-opacity-60">
          <div
            className="h-full bg-sky-400 transition-all duration-50"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StoriesPage;
