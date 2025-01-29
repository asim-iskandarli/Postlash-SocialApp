import { Request } from "express";

export type UserTypes = {
  id: string;
  fullname: string;
  username: string;
  avatar: string | null;
};

export interface AuthRequest extends Request {
  userId?: string;
}

export interface UserUpdateData {
  biography?: string;
  birthday?: string;
  avatar?: string;
}
