import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useMutation } from "@tanstack/react-query";
import { deleteNotifications, markNotificationsAsRead } from "../../api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/az";
import FollowButton from "../../components/user/FollowButton";
import { NotificationType } from "../../types";
import { setNotifications } from "../../redux/notifications/notificationsSlice";
import { Helmet } from "react-helmet-async";

const NotificationsPage = () => {
  const { notifications } = useAppSelector((state) => state.notifications);
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const deleteNotificationsMutation = useMutation({
    mutationKey: ["notifications/delete"],
    mutationFn: deleteNotifications,
  });

  useEffect(() => {
    dayjs.extend(relativeTime);
    dayjs.locale("az");
  }, [user?.id]);

  useEffect(() => {
    markAllAsRead();
  }, []);

  const handleClick = (notification: NotificationType) => {
    if (notification.type === "LIKE" && notification.post) {
      navigate(`/post/${notification.post.id}`);
    } else {
      navigate(`/profile/${notification.sender.username}`);
    }
  };

  const markAllAsRead = () => {
    if (notifications.filter((n: NotificationType) => !n.isRead).length > 0) {
      const updateNotifications = notifications.map((n: NotificationType) => ({
        ...n,
        isRead: true,
      }));

      dispatch(setNotifications(updateNotifications));
      markNotificationsAsRead();
    }
  };

  const handleDeleteNotifications = () => {
    deleteNotificationsMutation.mutate();
    dispatch(setNotifications([]));
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Helmet>
        <title>{import.meta.env.VITE_APP_NAME} | Bildirişlər</title>
      </Helmet>
      <div className="right-0 mt-2 w-[40rem] mx-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg dark:shadow-gray-800">
        <div className="flex flex-col">
          {notifications.length > 0 ? (
            <div className="p-2">
              {notifications.map((n: NotificationType) => (
                <div
                  className="flex items-center p-2 justify-between gap-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 duration-300 cursor-pointer"
                  key={n.id}
                >
                  <div
                    className="flex gap-2 flex-1"
                    onClick={() => handleClick(n)}
                  >
                    <img
                      className="w-12 h-12 rounded-full"
                      src={n.sender.avatar || "/noAvatar.png"}
                      alt="avatar"
                    />
                    <div className="flex-1 flex items-center  flex-wrap gap-2">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-200">
                        {n.sender.username}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-200">
                        {n.type === "LIKE"
                          ? "postunuzu bəyəndi"
                          : "sizi təqib etməyə başladı"}
                      </p>
                      <span className="text-xs dark:text-gray-400">
                        {dayjs(n.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                  <div>
                    {n.type === "LIKE" ? (
                      n.post?.media &&
                      n.post.media?.length > 0 && (
                        <img
                          className="w-10 h-10 rounded-md"
                          src={n.post.media[0]}
                          alt="post_picture"
                        />
                      )
                    ) : (
                      <FollowButton userId={n.senderId} small={true} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="min-h-40 flex items-center justify-center">
              <h2 className="font-semibold text-gray-500 dark:text-gray-400">
                Hələ heç bir bildirişiniz yoxdur.
              </h2>
            </div>
          )}
          <div className="w-full p-2 flex justify-center">
            <button
              onClick={handleDeleteNotifications}
              className="bg-gray-200 text-red-400 hover:text-red-500 dark:bg-gray-700 dark:hover:bg-gray-600  py-1 w-[96%] rounded-md font-semibold hover:bg-gray-300 duration-200"
            >
              Hamısını sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
