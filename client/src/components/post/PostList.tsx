import React, { useEffect } from "react";
import Post from "./Post";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../../redux/post/postSlice";
import PostSkeleton from "../skeletons/PostSkeletion";
import { fetchPosts } from "../../api";
import { PostType } from "../../types";

const PostList: React.FC = () => {
  const { posts } = useAppSelector((state) => state.post);
  const dispatch = useAppDispatch();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  useEffect(() => {
    if (data && posts.length === 0) {
      dispatch(getPosts(data));
    }
  }, [data]);

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (isError) {
    return <p>Xəta baş verdi</p>;
  }

  return (
    <section className="container mx-auto my-2 w-full">
      {posts.length > 0 ? (
        posts.map((post: PostType) => <Post key={post.id} post={post} />)
      ) : (
        <div className="p-4">
          <h2 className="text-2xl text-center font-semibold text-gray-400">
            Hələ heç bir post yoxdur.
          </h2>
        </div>
      )}
    </section>
  );
};

export default PostList;
