import express from "express";

import { auth } from "../middleware/authMiddleware";
import {
  deleteNotifications,
  getNotifications,
  markNotificationsAsRead,
} from "../controllers/notificationController";

const router = express.Router();

router.get("/:id", auth, getNotifications);
router.post("/markAsRead", auth, markNotificationsAsRead);
router.delete("/", auth, deleteNotifications);

export default router;
