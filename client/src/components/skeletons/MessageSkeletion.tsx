const MessageSkeletion = () => {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-700 h-[78vh] w-full p-4 rounded-lg mb-4 flex flex-col gap-12">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mt-2"></div>
        </div>
      </div>
      <div className="w-full">
        <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded-3xl w-1/2"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded-3xl w-1/2 mt-2 ml-auto"></div>
      </div>
    </div>
  );
};

export default MessageSkeletion;
