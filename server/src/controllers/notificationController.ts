import { Response } from "express";
import prisma from "../config/client";
import { AuthRequest } from "../types";

export const getNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.params.id;

  if (userId !== req.userId) {
    res
      .status(403)
      .json({ message: "Siz yalnız öz bildirişlərinizi əldə edə bilərsiniz." });
    return;
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        post: {
          select: {
            id: true,
            media: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const markNotificationsAsRead = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.userId;

  if (!userId) return;

  try {
    await prisma.notification.updateMany({
      where: {
        userId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
    res.status(200).json({
      message: "Bildirişlər oxundu olaraq işarələndi.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const deleteNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) return;

  try {
    await prisma.notification.deleteMany({
      where: {
        userId,
      },
    });
    res.status(200).json({ message: "Bütün bildirişlər silindi." });
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};
