import { useState } from "react";
import ConversationsList from "./ConversationsList";
import SearchConversation from "./SearchConversation";

const Dashboard = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="w-1/3 bg-white dark:bg-gray-800 shadow-sm">
      <div className=" dark:bg-gray-800 p-4">
        <h1 className="font-semibold dark:text-gray-200 text-lg sm:text-2xl">
          Söhbətlər
        </h1>
        <div className="mt-2">
          <input
            type="text"
            className="w-full outline-none bg-gray-100 py-2 px-4 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:placeholder:text-gray-300"
            placeholder="Söhbətlərdə axtar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {search ? (
          <SearchConversation searchKeyword={search} />
        ) : (
          <ConversationsList />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
