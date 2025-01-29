import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
};

export const decodeToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  return decoded;
};
