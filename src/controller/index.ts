import authController from "@/controller/auth.controller";
import express from "express";
import imageController from "@/controller/image.controller";
import checkAuth from "@/middleware/checkAuth.middleware";

const router = express.Router();

router.use("/auth", authController);
router.use("/image", checkAuth, imageController);

export default router;