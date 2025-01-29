import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import ScreenLoad from "../components/loaders/ScreenLoad";

const SocketContext = createContext<Socket | null>(null);

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newSocket: Socket = io(
      import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL
        : "http://localhost:5000",
      {
        withCredentials: true,
      }
    );

    setSocket(newSocket);
    setLoading(false);

    return () => {
      newSocket.close();
    };
  }, []);

  if (loading) return <ScreenLoad />;
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;

export const useSocket = () => {
  const context = useContext(SocketContext);

  return context;
};
