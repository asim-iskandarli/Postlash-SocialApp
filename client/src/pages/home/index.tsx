import CreatePost from "../../components/post/CreatePostButton";
import PostList from "../../components/post/PostList";
import Slidebar from "../../components/home/Slidebar";
import Discover from "../../components/home/Discover";
import Stories from "../../components/home/Stories";
import ActiveUsers from "../../components/home/ActiveUsers";
import { Helmet } from "react-helmet-async";

const HomePage = () => {
  return (
    <div className="flex min-h-screen gap-4 w-[90%] mx-auto pt-14 md:pt-20">
      <Helmet>
        <title>{import.meta.env.VITE_APP_NAME} | Ana səhifə</title>
      </Helmet>

      {/* Left */}
      <div className="w-2/6 hidden xl:flex">
        <Slidebar />
      </div>
      {/* Right */}
      <div className="w-full flex flex-col gap-2">
        <Stories />
        <div className="flex gap-2">
          <div className="w-full">
            <CreatePost />
            <PostList />
          </div>
          <div className="w-3/5 hidden md:block">
            <ActiveUsers />
            <Discover />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
