import { Request, Response } from "express";
import { AuthRequest } from "../types";
import { decodeToken, generateToken } from "../utils/token";
import prisma from "../config/client";
import bcrypt from "bcryptjs";
import { validateSignin, validateSignup } from "../utils/validation";

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: false,
  maxAge: 3600 * 24 * 100,
};

const includeUserData = {
  password: false,
  posts: {
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      likes: {
        select: {
          userId: true,
        },
      },
    },
  },
  followings: {
    select: {
      followerId: true,
    },
  },
};

export const signup = async (req: Request, res: Response) => {
  const { email, username, fullname, password } = req.body;

  const errors = validateSignup(req.body);
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0] });
    return;
  }

  try {
    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmail) {
      res.status(400).json({ message: "Bu email artıq mövcuddur." });
      return;
    }

    const existingUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername) {
      res.status(400).json({ message: "Bu istifadəçi adı artıq mövcuddur." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        fullname,
        password: hashedPassword,
      },
      include: includeUserData,
    });
    const token = generateToken(user.id);
    if (!user) return;

    res
      .status(201)
      .cookie("token", token, options)
      .json({ ...user, password: undefined });
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const errors = validateSignin(req.body);
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0] });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: includeUserData,
    });

    const matchPassword = await bcrypt.compare(password, user?.password || "");

    if (!user || !matchPassword) {
      res
        .status(400)
        .json({ message: "İstifadəçi adı və ya şifrə yanlışdır!" });
      return;
    }

    const token = generateToken(user.id);

    res.cookie("token", token, options).json({ ...user, password: undefined });
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};

export const refreshUser = async (req: AuthRequest, res: Response) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({
      message: "Token mövcud deyil. Zəhmət olmasa, təqdim edin.",
    });
    return;
  }

  const decoded = decodeToken(token);
  if (!decoded) {
    res.status(403).json({
      message: "Token mövcud deyil. Zəhmət olmasa, təqdim edin.",
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      include: includeUserData,
    });

    if (!user) {
      res.status(404).json({
        message: "İstifadəçi tapılmadı. Zəhmət olmasa, məlumatları yoxlayın.",
      });
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

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ message: "Çıxış uğurla həyata keçirildi!" });
  } catch (error) {
    res.status(500).json({
      message:
        "Sistemimizdə gözlənilməz bir problem baş verdi, Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
    });
  }
};
