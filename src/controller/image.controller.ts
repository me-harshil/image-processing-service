import uploadImageController from "@/controller/image/uploadImageController";
import { Router } from "express";

const imageRouter = Router();

imageRouter.post("", uploadImageController);

export default imageRouter;