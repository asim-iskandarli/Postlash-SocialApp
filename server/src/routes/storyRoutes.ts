import express from "express";
import { createStory, getStories } from "../controllers/storyController";
import { auth } from "../middleware/authMiddleware";
import { upload } from "../config/cloudinary";

const router = express.Router();

router.get("/", auth, getStories);
router.post("/create", upload.single("media"), auth, createStory);

export default router;
