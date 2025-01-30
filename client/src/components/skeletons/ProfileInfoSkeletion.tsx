const ProfileInfoSkeletion = () => {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-700 h-56 w-full p-4 rounded-lg mb-4 flex flex-col gap-12">
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 md:w-48 md:h-48 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoSkeletion;
