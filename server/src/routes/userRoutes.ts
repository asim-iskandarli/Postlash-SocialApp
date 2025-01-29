import express from "express";
import {
  followUser,
  getBookmarks,
  getFollowers,
  getFollowings,
  getNewUsers,
  getUser,
  searchUser,
  updateUser,
} from "../controllers/userController";
import { auth } from "../middleware/authMiddleware";
import { upload } from "../config/cloudinary";

const router = express.Router();

router.get("/search", searchUser);
router.get("/user/:username", getUser);
router.get("/newusers", getNewUsers);
router.get("/bookmarks", auth, getBookmarks);
router.post("/:userId/follow", auth, followUser);
router.post("/:userId/update", upload.single("avatar"), auth, updateUser);
router.get("/:userId/followers", auth, getFollowers);
router.get("/:userId/followings", auth, getFollowings);

export default router;
