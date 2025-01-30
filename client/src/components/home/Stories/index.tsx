import CreateStory from "./CreateStory";

import StoryList from "./StoryList";

const Stories = () => {
  return (
    <div className="px-3 md:px-8 py-4 md:py-6 bg-white rounded-lg dark:bg-gray-800 shadow-sm dark:shadow-gray-800">
      <h2 className="mb-6 font-semibold text-gray-500 text-2xl dark:text-gray-300">
        Hekayələr
      </h2>
      <div className="flex gap-2 overflow-x-auto p-2">
        <CreateStory />
        <StoryList />
      </div>
    </div>
  );
};

export default Stories;
