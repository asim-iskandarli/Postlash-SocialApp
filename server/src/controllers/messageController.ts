import { Response } from "express";
import prisma from "../config/client";
import { AuthRequest } from "../types";
import { uploadToCloudinary } from "../config/cloudinary";
import { io } from "../app";
import { activeUsers } from "../socket";

export const createMessage = async (req: AuthRequest, res: Response) => {
  const { content, receiverId } = req.body;
  const userId = req.userId;
  if (!userId || !content || !receiverId) {
    res.status(400).json({
      message: "Mesaj göndərmək üçün lazımi məlumatlar tamamlanmayıb.",
    });
    return;
  }

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
    const newMessage = await prisma.message.create({
      data: {
        content,
        senderId: userId,
        receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            avatar: true,
            username: true,
          },
        },
        receiver: {
          select: {
            id: true,
            avatar: true,
            username: true,
          },
        },
      },
    });

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId,
          },
          {
            senderId: receiverId,
            receiverId: userId,
          },
        ],
      },
    });

    if (existingConversation) {
      var updatedConversation = await prisma.conversation.update({
        where: {
          id: existingConversation.id,
        },
        data: {
          content,
        },
        include: {
          sender: {
            select: {
              id: true,
              avatar: true,
              username: true,
            },
          },
          receiver: {
            select: {
              id: true,
              avatar: true,
              username: true,
            },
          },
        },
      });
    } else {
      var newConversation = await prisma.conversation.create({
        data: {
          senderId: userId,
          receiverId,
          content,
        },
        include: {
          sender: {
            select: {
              id: true,
              avatar: true,
              username: true,
            },
          },
          receiver: {
            select: {
              id: true,
              avatar: true,
              username: true,
            },
          },
        },
      });
    }
    const receiverUser = activeUsers.get(receiverId);

    if (receiverUser) {
      receiverUser.sockets.forEach((socketId) => {
        io.to(socketId).emit("receive-message", {
          newMessage,
          conversation: existingConversation
            ? updatedConversation
            : newConversation,
        });
      });
    }

    const senderUser = activeUsers.get(userId);

    if (senderUser) {
      senderUser.sockets.forEach((socketId) => {
        io.to(socketId).emit("send-message", {
          newMessage,
          conversation: existingConversation
            ? updatedConversation
            : newConversation,
        });
      });
    }

    res.status(200).json("Mesaj göndərildi");
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;

  if (!userId) return;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: "İstifadəçi mövcud deyil!" });
    }
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: req.userId },
          { senderId: req.userId, receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            avatar: true,
            username: true,
          },
        },
        receiver: {
          select: {
            id: true,
            avatar: true,
            username: true,
          },
        },
      },
    });
    res.json({ messages, user });
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const getConversation = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return;

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            avatar: true,
            username: true,
          },
        },
        receiver: {
          select: {
            id: true,
            avatar: true,
            username: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const deleteMessage = async (req: AuthRequest, res: Response) => {
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
    res.json("Mesaj uğurla silindi.");
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};
