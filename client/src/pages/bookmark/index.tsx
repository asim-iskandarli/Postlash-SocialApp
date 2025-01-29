import { useQuery } from "@tanstack/react-query";
import { getBookmarks } from "../../api";
import { useEffect, useState } from "react";
import { BookmarkType } from "../../types";
import Post from "../../components/post/Post";
import PostSkeleton from "../../components/skeletons/PostSkeletion";
import { Helmet } from "react-helmet-async";

const BookmarkPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user/bookmarks"],
    queryFn: getBookmarks,
  });
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);

  useEffect(() => {
    if (data) {
      console.log(data);
      setBookmarks(data);
    }
  }, [data]);

  return (
    <div className="pt-20 min-h-screen">
      <Helmet>
        <title>{import.meta.env.VITE_APP_NAME} | Əlfəcinlər</title>
      </Helmet>
      <div className="w-full sm:w-3/4 md:w-2/4 px-2 mx-auto flex flex-col">
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : bookmarks?.length > 0 ? (
          bookmarks.map(
            (bookmark) =>
              bookmark.post && <Post key={bookmark.id} post={bookmark.post} />
          )
        ) : (
          <div className="min-h-[85vh] flex items-center justify-center">
            <h2 className="text-xl text-gray-400 font-semibold">
              Hələ bookmark əlavə etməmisiniz.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkPage;
