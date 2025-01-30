import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { useEffect } from "react";
import ScreenLoad from "./components/loaders/ScreenLoad";
import { fetchRefreshUser, getStories } from "./api";
import { useQuery } from "@tanstack/react-query";
import { setUser, setLoading } from "./redux/auth/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import { setDarkMode } from "./redux/theme/themeSlice";
import { useSocket } from "./context/SocketContext";
import { setActiveUsers } from "./redux/user/userSlice";
import routes from "./routes";
import { setStories } from "./redux/stories/storiesSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const socket = useSocket();

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["refreshuser"],
    queryFn: fetchRefreshUser,
  });

  const { data: storiesData } = useQuery({
    queryKey: ["get/stories"],
    queryFn: getStories,
    enabled: !!user?.id,
  });

  // Get session and active users
  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
      if (socket) {
        socket.emit("get_active_users");
        socket.on("online_users", (users) => {
          dispatch(setActiveUsers(users));
        });
      }
    } else if (isError) {
      dispatch(setLoading(false));
    }

    return () => {
      if (socket) {
        socket.off("online_users");
      }
    };
  }, [isSuccess, data, isError, dispatch]);

  // Dark mode
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    dispatch(setDarkMode(savedMode));
  }, [dispatch]);

  // Get stories
  useEffect(() => {
    if (storiesData) {
      dispatch(setStories(storiesData));
    }
  }, [storiesData]);

  if (loading) {
    return <ScreenLoad />;
  }

  return (
    <>
      {user && <Navbar />}
      <ToastContainer
        position="bottom-center"
        theme={isDarkMode ? "dark" : "light"}
        toastClassName="dark:bg-gray-900 dark:text-gray-300"
      />
      <Routes>
        {routes.map(({ path, element, isProtected }) =>
          isProtected ? (
            <Route
              key={path}
              path={path}
              element={<ProtectedRoute>{element}</ProtectedRoute>}
            />
          ) : (
            <Route key={path} path={path} element={element} />
          )
        )}
      </Routes>
    </>
  );
}

export default App;
