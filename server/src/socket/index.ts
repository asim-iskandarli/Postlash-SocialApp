import { Server } from "socket.io";
import { getUser } from "../utils/getUser";
import { UserTypes } from "../types";
import { Socket } from "socket.io";
import { Server as HttpServer } from "http";

interface User {
  id: string;
  username: string;
  fullname: string;
  avatar: string | null;
  sockets: Set<string>;
}

export const activeUsers = new Map<string, User>();

export const createSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    const cookieHeader = socket.handshake.headers.cookie;
    const token = await cookieParser(cookieHeader);
    if (!token) {
      socket.emit("error", {
        message: "Token mövcud deyil və ya etibarsızdır.",
      });
      socket.disconnect();
      return;
    }

    const user: UserTypes | null = await getUser(token);
    if (!user) {
      socket.disconnect();
      return;
    }
    if (activeUsers.has(user.id)) {
      activeUsers.get(user.id)?.sockets.add(socket.id);
    } else {
      activeUsers.set(user.id, {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        avatar: user.avatar,
        sockets: new Set([socket.id]),
      });
    }

    sendActiveUsers(io);

    socket.on("get_active_users", () => {
      sendActiveUsers(socket);
    });

    socket.on("disconnect", () => {
      activeUsers.forEach((user, id) => {
        if (user.sockets.has(socket.id)) {
          user.sockets.delete(socket.id);
        }
        if (user.sockets.size === 0) {
          activeUsers.delete(user.id);
        }
      });
      sendActiveUsers(io);
    });
  });

  return io;
};

const sendActiveUsers = (socketio: Socket | Server) => {
  const usersList = Array.from(activeUsers.entries()).map(
    ([id, { username, avatar, fullname }]) => ({
      id,
      username,
      fullname,
      avatar,
    })
  );
  socketio.emit("online_users", Array.from(usersList));
};

const cookieParser = async (cookieHeader: string | undefined) => {
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c: string) => c.split("="))
    );

    return cookies.token;
  }
};
