const ConversationSkeletion = () => {
  return (
    <div className="animate-pulse mt-6 w-full rounded-lg mb-4 flex flex-col gap-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mt-2"></div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mt-2"></div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default ConversationSkeletion;
