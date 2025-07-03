import authController from "@/controller/auth.controller";
import express from "express";

const router = express.Router();

router.use("/auth", authController);

export default router;