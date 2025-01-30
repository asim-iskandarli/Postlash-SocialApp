import { Response } from "express";
import prisma from "../config/client";
import { AuthRequest } from "../types";
import { uploadToCloudinary } from "../config/cloudinary";

export const getStories = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const userStory = await prisma.story.findFirst({
      where: {
        userId,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullname: true,
            avatar: true,
          },
        },
      },
    });

    const otherStories = await prisma.story.findMany({
      where: {
        userId: {
          not: userId,
        },
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullname: true,
            avatar: true,
          },
        },
      },
    });

    if (!userStory) {
      res.status(200).json(otherStories);
      return;
    }

    res.status(200).json([userStory, ...otherStories]);
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const createStory = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const image = req.file;

  if (!userId || !image) return;
  try {
    const uploadedMedia = await uploadToCloudinary(image.buffer, "stories");

    const existingStory = await prisma.story.findFirst({
      where: {
        userId,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (existingStory) {
      await prisma.story.delete({
        where: {
          id: existingStory.id,
        },
      });
    }

    const newStory = await prisma.story.create({
      data: {
        userId,
        media: uploadedMedia.secure_url,
        expiresAt: new Date(new Date().setDate(new Date().getDate() + 1)),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullname: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json(newStory);
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};
