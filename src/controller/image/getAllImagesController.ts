import catchAsync from "@/utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import Image from "@/models/image.model";
import { logger } from "@/config/logger";
import AppError from "@/utils/appError";
import ApiResponse from "@/utils/ApiResponse";

const getAllImagesController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Start executing getAllImagesController");

    logger.info("Successfully executed getAllImagesController");
    return res.status(200).json(new ApiResponse({}, "Images fetched successfully", 200));
})

export default getAllImagesController