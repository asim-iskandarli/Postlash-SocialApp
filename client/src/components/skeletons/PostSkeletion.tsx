const PostSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col space-y-4 mb-3 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 w-full">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mt-2"></div>
        </div>
      </div>

      {/* Image */}
      <div className="h-48 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>

      {/* Content */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-4/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/6"></div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;
