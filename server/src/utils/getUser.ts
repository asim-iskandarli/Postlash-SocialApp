import { decodeToken } from "./token";
import prisma from "../config/client";

export const getUser = async (token: string) => {
  if (!token) {
    return null;
  }

  try {
    const decoded = decodeToken(token);
    if (!decoded) {
      return null;
    }
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        avatar: true,
        username: true,
        fullname: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};
