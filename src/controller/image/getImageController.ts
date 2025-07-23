import catchAsync from "@/utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { logger } from "@/config/logger";
import AppError from "@/utils/appError";
import Image from "@/models/image.model";
import ApiResponse from "@/utils/ApiResponse";

const getImageController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Started executing getImageController");
    const imageId = req.params.id;
    if (!imageId) {
        throw new AppError("Image ID is required", 400);
    }
    const image = await Image.findById(imageId);
    if (!image) {
        throw new AppError("Image not found", 404);
    }

    // Check if the user is authorized to access the image
    if ((image.owner).toString() !== req.user.id) {
        throw new AppError("You do not have permission to access this image", 403);
    }

    logger.info("Successfully executed getImageController");
    return res.status(200).json(new ApiResponse(image, "Image retrieved successfully", 200));
});


export default getImageController;