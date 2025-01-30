import Messages from "../../components/message/Messages";
import CreateMessage from "../../components/message/CreateMessage";
import { useParams } from "react-router-dom";
import Dashboard from "../../components/message/Dashboard";
import { Helmet } from "react-helmet-async";

const MessagePage = () => {
  const { id } = useParams();

  return (
    <div className="flex w-full lg:w-2/3 mx-auto min-h-screen pt-14 md:pt-20">
      <Helmet>
        <title>{import.meta.env.VITE_APP_NAME} | Söhbətlər</title>
      </Helmet>
      <Dashboard />
      <div className="w-2/3 bg-white dark:bg-gray-800 shadow-md">
        {id ? (
          <div className="h-full">
            <Messages userId={id} />
            <CreateMessage userId={id} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <h1 className="dark:text-gray-300 font-semibold text-xl">
              Yeni söhbətə başla...
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
