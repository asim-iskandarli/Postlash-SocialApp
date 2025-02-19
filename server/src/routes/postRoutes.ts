import express from "express";

import { auth } from "../middleware/authMiddleware";
import {
  createCommentToPost,
  createPost,
  deletePost,
  getComments,
  getPosts,
  likePost,
  toggleBookmark,
} from "../controllers/postController";
import { upload } from "../config/cloudinary";

const router = express.Router();

router.post("/create", upload.array("media", 10), auth, createPost);
router.get("/", getPosts);
router.delete("/:id", auth, deletePost);
router.post("/:postId/like", auth, likePost);
router.post("/:postId/bookmark", auth, toggleBookmark);
router.post("/:postId/comments", auth, createCommentToPost);
router.get("/:postId/comments", getComments);

export default router;
