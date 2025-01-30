import { useAppSelector } from "../../../redux/hooks";
import { StoryType } from "../../../types";
import Story from "./Story";

const StoryList = () => {
  const { stories } = useAppSelector((state) => state.stories);

  return (
    <div className="flex gap-2">
      {stories.length > 0 &&
        stories.map((story: StoryType) => (
          <>
            <Story story={story} key={story.id} />
            <Story story={story} key={story.id} />
          </>
        ))}
    </div>
  );
};

export default StoryList;
