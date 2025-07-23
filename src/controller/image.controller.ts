import uploadImageController from "@/controller/image/uploadImageController";
import { Router } from "express";
import upload from "@/middleware/multer.middleware";
import imageTransformController from "@/controller/image/imageTransformController";
import getImageController from "@/controller/image/getImageController";
import getAllImagesController from "@/controller/image/getAllImagesController";

const imageRouter: Router = Router();

imageRouter.get("/", getAllImagesController);
imageRouter.get("/:id", getImageController);
imageRouter.post("/upload", upload.single("image"),uploadImageController);
imageRouter.post("/:id/transform",imageTransformController);


export default imageRouter;