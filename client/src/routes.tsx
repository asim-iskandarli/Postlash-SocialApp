import HomePage from "./pages/home";
import SigninPage from "./pages/auth/SignIn";
import SignupPage from "./pages/auth/SignUp";
import ProfilePage from "./pages/profile";
import NotFound from "./components/NotFound";
import MessagesPage from "./pages/message";
import BookmarkPage from "./pages/bookmark";
import NotificationsPage from "./pages/notifications";
import SettingsPage from "./pages/settings";
import StoriesPage from "./pages/stories";
import SearchPage from "./pages/search";

const routes = [
  { path: "/", element: <HomePage />, isProtected: true },
  { path: "/signin", element: <SigninPage />, isProtected: false },
  { path: "/signup", element: <SignupPage />, isProtected: false },
  { path: "/profile", element: <ProfilePage />, isProtected: true },
  { path: "/profile/:username", element: <ProfilePage />, isProtected: true },
  { path: "/stories/:storyId", element: <StoriesPage />, isProtected: true },
  { path: "/settings", element: <SettingsPage />, isProtected: true },
  { path: "/messages", element: <MessagesPage />, isProtected: true },
  { path: "/search", element: <SearchPage />, isProtected: true },
  { path: "/bookmarks", element: <BookmarkPage />, isProtected: true },
  { path: "/notifications", element: <NotificationsPage />, isProtected: true },
  {
    path: "/messages/:id",
    element: <MessagesPage />,
    isProtected: true,
  },
  { path: "*", element: <NotFound />, isProtected: false },
];

export default routes;
