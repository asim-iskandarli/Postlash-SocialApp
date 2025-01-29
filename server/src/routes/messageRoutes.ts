import express from "express";
import { auth } from "../middleware/authMiddleware";
import { upload } from "../config/cloudinary";
import {
  createMessage,
  deleteMessage,
  getConversation,
  getMessages,
} from "../controllers/messageController";

const router = express.Router();

router.post("/create", upload.array("media", 10), auth, createMessage);
router.get("/conversations", auth, getConversation);
router.get("/:userId", auth, getMessages);
router.delete("/:messageId", auth, deleteMessage);

export default router;
