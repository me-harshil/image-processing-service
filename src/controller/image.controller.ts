import uploadImageController from "@/controller/image/uploadImageController";
import { Router } from "express";
import upload from "@/middleware/multer.middleware";

const imageRouter = Router();

imageRouter.post("/upload", upload.single("image"),uploadImageController);

export default imageRouter;