import { Request, Response } from "express";
import prisma from "../config/client";
import { AuthRequest, UserUpdateData } from "../types";
import { uploadToCloudinary } from "../config/cloudinary";
import { activeUsers } from "../socket";
import { io } from "../app";

export const getUser = async (req: Request, res: Response) => {
  const { username } = req.params;

  if (!username) return;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        posts: {
          include: {
            user: {
              select: {
                id: true,
                avatar: true,
                username: true,
              },
            },
            likes: {
              select: {
                userId: true,
              },
            },
            bookmarks: {
              select: {
                userId: true,
              },
            },
            _count: {
              select: {
                comments: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            followers: true,
            followings: true,
            posts: true,
          },
        },
      },
    });
    if (!user) {
      res.status(404).json({ message: "İstifadəçi tapılmadı!" });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const getNewUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        username: true,
        fullname: true,
        avatar: true,
      },
    });
    if (!users) {
      res.json({ message: "Hal-hazırda yeni istifadəçi mövcud deyil." });
      return;
    }

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const followUser = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  const currentId = req.userId;

  if (!userId || !currentId) return;
  if (userId === currentId) return;

  try {
    const existingUsers = await prisma.user.findMany({
      where: {
        id: {
          in: [userId, currentId],
        },
      },
    });
    if (existingUsers.length !== 2) {
      res.status(404).json({ message: "İstifadəçi mövcud deyil." });
      return;
    }

    const isFollowing = await prisma.follower.findFirst({
      where: {
        followerId: userId,
        followingId: currentId,
      },
    });
    if (isFollowing) {
      await prisma.follower.delete({
        where: {
          id: isFollowing.id,
        },
      });
      await prisma.notification.deleteMany({
        where: {
          type: "FOLLOW",
          senderId: currentId,
          userId,
        },
      });
      res.status(200).json({ message: "İstifadəçi izləmədən çıxarıldı." });
    } else {
      await prisma.follower.create({
        data: {
          followerId: userId,
          followingId: currentId,
        },
      });
      const newNotification = await prisma.notification.create({
        data: {
          type: "FOLLOW",
          senderId: currentId,
          userId,
        },
      });

      const socketReceiverUser = activeUsers.get(userId);
      if (socketReceiverUser) {
        socketReceiverUser.sockets.forEach((socketId) => {
          io.to(socketId).emit("notification", newNotification);
        });
      }
      res.status(200).json({ message: "İstifadəçi izlənildi." });
    }
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const searchUser = async (req: AuthRequest, res: Response) => {
  const { name } = req.query;

  if (!name) {
    res.status(400).json({ message: "Ad parametri tələb olunur!" });
    return;
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: name as string,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        fullname: true,
      },
    });

    if (users.length === 0) {
      res.json({ message: "Heç bir istifadəçi tapılmadı!" });
      return;
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  const { biography, birthday } = req.body;
  console.log(biography, birthday);

  const userId = req.params.userId;

  if (!userId || userId !== req.userId) {
    res
      .status(403)
      .json({ message: "Bu əməliyyatı yerinə yetirmək üçün icazəniz yoxdur." });
    return;
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });

    if (!currentUser) {
      res.status(404).json({ message: "İstifadəçi mövcud deyil." });
      return;
    }
    let imageUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "profile_pictures"
      );

      if (result) {
        imageUrl = result?.secure_url;
      }
    }

    const updatedData: UserUpdateData = {};
    if (biography) updatedData.biography = biography;
    if (birthday) updatedData.birthday = new Date(birthday).toISOString();
    if (imageUrl) updatedData.avatar = imageUrl || currentUser?.avatar;

    await prisma.user.update({
      where: {
        id: req.userId,
      },
      data: { ...updatedData },
    });

    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const getBookmarks = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) return;

  try {
    const getBookmarks = await prisma.bookmark.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            avatar: true,
            username: true,
            fullname: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            userId: true,
            createdAt: true,
            media: true,
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                fullname: true,
              },
            },
            likes: {
              select: {
                userId: true,
              },
            },
            bookmarks: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(getBookmarks);
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const getFollowers = async (req: AuthRequest, res: Response) => {
  const userId = req.params.userId;

  if (!userId) return;

  try {
    const getFollowers = await prisma.follower.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
          select: {
            id: true,
            avatar: true,
            username: true,
            fullname: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(getFollowers);
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const getFollowings = async (req: AuthRequest, res: Response) => {
  const userId = req.params.userId;

  if (!userId) return;

  try {
    const getFollowings = await prisma.follower.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: {
          select: {
            id: true,
            avatar: true,
            username: true,
            fullname: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(getFollowings);
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};
