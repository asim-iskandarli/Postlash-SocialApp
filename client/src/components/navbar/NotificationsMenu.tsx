import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RiNotification2Fill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { getNotifications, markNotificationsAsRead } from "../../api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/az";
import FollowButton from "../user/FollowButton";
import { useSocket } from "../../context/SocketContext";
import { NotificationType } from "../../types";
import {
  addNotifications,
  setNotifications,
} from "../../redux/notifications/notificationsSlice";

const NotificationsMenu = () => {
  const { notifications } = useAppSelector((state) => state.notifications);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const socket = useSocket();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;
  const { data } = useQuery({
    queryKey: ["get/notifications"],
    queryFn: () => getNotifications(user.id),
    enabled: !!user.id,
  });

  useEffect(() => {
    if (data) {
      dispatch(setNotifications(data.notifications));
    }
  }, [data]);

  useEffect(() => {
    dayjs.extend(relativeTime);
    dayjs.locale("az");
  }, [user?.id]);

  // Socket
  useEffect(() => {
    if (socket) {
      socket.on("notification", (notification) => {
        dispatch(addNotifications(notification));
      });
    }

    return () => {
      if (socket) {
        socket.off("notification");
      }
    };
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      setUnreadCount(
        notifications.filter((n: NotificationType) => !n.isRead).length
      );
    }
  }, [notifications]);

  useEffect(() => {
    if (isOpen) {
      markAllAsRead();
    }
  }, [isOpen]);

  const handleClick = (notification: NotificationType) => {
    if (notification.type === "LIKE" && notification.post) {
      navigate(`/post/${notification.post.id}`);
    } else {
      navigate(`/profile/${notification.sender.username}`);
    }
    setIsOpen(false);
  };

  const markAllAsRead = () => {
    if (notifications.filter((n: NotificationType) => !n.isRead).length > 0) {
      const updateNotifications = notifications.map((n: NotificationType) => ({
        ...n,
        isRead: true,
      }));

      dispatch(setNotifications(updateNotifications));
      setUnreadCount(0);
      markNotificationsAsRead();
    }
  };
  return (
    <div className="relative">
      {/* Profil Button */}
      <div
        ref={buttonRef}
        className="text-gray-500  hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-500 w-9 h-9 flex justify-center items-center rounded-full duration-200 cursor-pointer select-none"
        onClick={toggleMenu}
      >
        <RiNotification2Fill size={22} />
        {unreadCount > 0 && (
          <span className="absolute z-10 bg-red-400 text-white flex items-center justify-center rounded-full -right-[1px] -top-[1px] text-[10px] w-5 h-5">
            {unreadCount}
          </span>
        )}
      </div>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-[30rem] bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg dark:shadow-gray-800"
          ref={menuRef}
        >
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
                        <h4 className="font-semibold dark:text-gray-200">
                          {n.sender.username}
                        </h4>
                        <p className="text-sm dark:text-gray-200">
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
              <h2 className="text-center mt-10 font-semibold text-gray-500 dark:text-gray-400">
                Hələ heç bir bildirişiniz yoxdur.
              </h2>
            )}
            <div className="w-full p-2 flex justify-center mt-8">
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="bg-gray-200 text-center dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-gray-300 py-1 w-[96%] rounded-md font-semibold hover:bg-gray-300 duration-200"
              >
                Bütün bildirişlərə baxın
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsMenu;
