import { Request, Response } from "express";
import prisma from "../config/client";
import { AuthRequest } from "../types";
import { uploadToCloudinary } from "../config/cloudinary";
import { io } from "../app";
import { activeUsers } from "../socket";

export const createPost = async (req: AuthRequest, res: Response) => {
  const { content } = req.body;
  const userId = req.userId;
  if (!userId || !content) return;

  try {
    let mediaUrls: string[] = [];

    if (Array.isArray(req.files)) {
      if (req.files.length > 4) {
        res
          .status(400)
          .json({ message: "Maksimum 4 şəkil yükləyə bilərsiniz." });
        return;
      }
      if (req.files.length > 0) {
        for (const file of req.files) {
          const uploadedMedia = await uploadToCloudinary(
            file.buffer,
            "post_images"
          );
          mediaUrls.push(uploadedMedia.secure_url);
        }
      }
    }
    const newPost = await prisma.post.create({
      data: {
        content,
        userId,
        media: mediaUrls || [],
      },
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
      },
    });

    res.json(newPost);
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const getPosts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            avatar: true,
            username: true,
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
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({ getPosts });
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const id = req.params.id;

  if (!userId || !id) return;
  try {
    await prisma.post.delete({
      where: {
        id,
        userId,
      },
    });
    res.json("Uğurla silindi.");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const likePost = async (req: AuthRequest, res: Response) => {
  const currentUserId = req.userId;
  const { postId } = req.params;

  if (!currentUserId || !postId) return;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      res.status(404).json({ message: "Post mövcud deyil." });
      return;
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        postId: postId,
        userId: currentUserId,
      },
    });
    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      await prisma.notification.deleteMany({
        where: {
          type: "LIKE",
          userId: post.userId,
          postId: post.id,
        },
      });
      res.json({ message: "Post bəyənməni uğurla geri aldınız." });
    } else {
      await prisma.like.create({
        data: {
          userId: currentUserId,
          postId,
        },
      });

      if (post?.userId !== currentUserId) {
        const newNotification = await prisma.notification.create({
          data: {
            type: "LIKE",
            senderId: currentUserId,
            userId: post?.userId,
            postId: post?.id,
          },
          include: {
            sender: true,
          },
        });

        const socketUser = activeUsers.get(post?.userId);
        if (socketUser) {
          socketUser.sockets.forEach((socketId) => {
            io.to(socketId).emit("notification", { ...newNotification, post });
          });
        }
      }
      res.json({ message: "Post uğurla bəyənildi." });
    }
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const toggleBookmark = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const { postId } = req.params;

  if (!userId || !postId) return;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      res.status(404).json({ message: "Post mövcud deyil." });
      return;
    }

    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });
    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: {
          id: existingBookmark.id,
        },
      });

      res.json({ message: "Bookmarkı uğurla geri aldınız." });
    } else {
      await prisma.bookmark.create({
        data: {
          userId: userId,
          postId,
        },
      });

      res.json({ message: "Bookmark uğurla əlavə olundu." });
    }
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

// Comment
export const createCommentToPost = async (req: AuthRequest, res: Response) => {
  const { content } = req.body;
  const postId = req.params.postId;
  const userId = req.userId;
  if (!userId || !content || !postId) return;

  try {
    const newComment = await prisma.comment.create({
      data: {
        postId,
        userId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            avatar: true,
            username: true,
          },
        },
      },
    });

    res.json(newComment);
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};
export const getComments = async (req: Request, res: Response) => {
  const postId = req.params.postId;

  if (!postId) return;
  try {
    const getComments = await prisma.comment.findMany({
      where: {
        postId,
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
      },
    });
    res.json(getComments);
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};
