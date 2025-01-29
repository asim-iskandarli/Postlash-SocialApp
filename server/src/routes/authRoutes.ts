import express from "express";
import {
  logout,
  refreshUser,
  signin,
  signup,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/refreshUser", refreshUser);

export default router;
