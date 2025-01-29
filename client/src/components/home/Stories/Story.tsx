import { Link } from "react-router-dom";
import { StoryType } from "../../../types";

const Story = ({ story }: { story: StoryType }) => {
  return (
    <Link
      to={`/stories/${story.id}`}
      className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-blue-200 via-blue-300 to-blue-400 p-[3px]"
    >
      <div className="cursor-pointer w-full h-full">
        <img
          src={story.user.avatar || "/noAvatar.png"}
          className=" object-cover rounded-full w-full h-full"
          alt="avatar"
        />
      </div>
    </Link>
  );
};

export default Story;
