import { logger } from "@/config/logger";
import { Request, Response } from "express";
import catchAsync from "@/utils/catchAsync";
import AppError from "@/utils/appError";
import { uploadFileToAws } from "@/utils/awsS3connect";
import ApiResponse from "@/utils/ApiResponse";
import User from "@/models/user.model";
import Image from "@/models/image.model";

const uploadImageController = catchAsync(async (req: Request, res: Response) => {
    logger.info("Started executing uploadImageController");
    if (!req.file) {
        throw new AppError("Image is required", 400);
    }
    const { filename, path } = req.file;
    const imageUploadResponse = await uploadFileToAws(filename, path)
    const newImage = await Image.create({ imageFile: imageUploadResponse?.url, owner: req.user.id });
    await User.findByIdAndUpdate(req.user.id, { $push: { images: newImage.id } }, { new: true });
    logger.info("Successfully executed uploadImageController");


    res.status(200).json(new ApiResponse({ image: newImage.imageFile, owner: newImage.owner }, "Image uploaded successfully", 200));
});

export default uploadImageController;