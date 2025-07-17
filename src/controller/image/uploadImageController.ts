import { logger } from "@/config/logger";
import { Request, Response } from "express";
import catchAsync from "@/utils/catchAsync";
import {imageService} from "@/services/index"

const uploadImageController = catchAsync(async (req: Request, res: Response) => {
    logger.info("Started executing uploadImageController");
    
    const response = await imageService.imageUploadService();
    res.status(200).json({ message: "Image uploaded successfully" });
    logger.info("Successfully executed uploadImageController");

});

export default uploadImageController;