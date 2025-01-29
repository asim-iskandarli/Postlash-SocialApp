import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { decodeToken } from "../utils/token";

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "Giriş tələb olunur!" });
    return;
  }

  try {
    const decoded = decodeToken(token);
    if (!decoded) {
      res.status(401).json({ message: "Yanlish token" });
      return;
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server xetasi" });
  }
};
