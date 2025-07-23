import catchAsync from "@/utils/catchAsync";
import sharp from "sharp";
import User from "@/models/user.model";
import Image from "@/models/image.model";
import AppError from "@/utils/appError";
import { uploadFileToAws, deleteFileFromAws } from "@/utils/awsS3connect";
import path from "path";
import { logger } from "@/config/logger";
import ApiResponse from "@/utils/ApiResponse";

// The request body should contain the transformations object with the following structure:
// {
//   "transformations": {
//     "resize": {
//       "width": "number",
//       "height": "number"
//     },
//     "crop": {
//       "width": "number",
//       "height": "number",
//       "x": "number",
//       "y": "number"
//     },
//     "rotate": "number",
//     "format": "string",
//     "filters": {
//       "grayscale": "boolean",
//       "sepia": "boolean"
//     }
//   }
// }

const imageTransformController = catchAsync(async (req, res, next) => {
    logger.info("Start executing imageTransformController")
    const imageId = req.params.id;
    const user = await User.findById(req.user.id);
    if (!user.images.includes(imageId)) {
        throw new AppError("You are not authorized to perform this action", 401);
    }
    const image = await Image.findById(imageId);
    if (!image) {
        throw new AppError("Image not found", 404);
    }

    const transformations = req.body.transformations;
    if (!transformations) {
        throw new AppError("Transformations are required", 400);
    }

    // Download the image from S3
    const fileResponse = await fetch(image.imageFile);
    if (!fileResponse.ok) {
        throw new AppError("Failed to download image from S3", 500);
    }

    const imageBuffer = await fileResponse.arrayBuffer();

    const resize = transformations?.resize || null;
    const crop = transformations?.crop || null;
    const rotate = transformations?.rotate || 0;
    const format = transformations?.format || null;
    const filters = transformations?.filters || {};

    const originalFile = image.imageFile.split("/").pop();
    const fileName = originalFile.split(".")[0];
    const fileExtension = format ? format : originalFile.split(".").pop();
    const filePath = path.join(process.cwd(), 'public', 'uploads', `${fileName}-transformed.${fileExtension}`);


    let sharpInstance = sharp(imageBuffer);

    // Resize the image if specified
    if (resize) {
        sharpInstance = sharpInstance.resize({
            width: parseInt(resize.width),
            height: parseInt(resize.height),
            // fit: 'fill'
        })
    }

    // Crop the image if specified
    if (crop) {
        sharpInstance = sharpInstance.extract({
            left: parseInt(crop.x) || 0,
            top: parseInt(crop.y) || 0,
            width: parseInt(crop.width),
            height: parseInt(crop.height)
        })
    }

    // Rotate the image if specified
    if (rotate && rotate !== 0) {
        sharpInstance = sharpInstance.rotate(parseInt(rotate));
    }

    // Apply filters if specified - grayscale
    if (filters.grayscale) {
        sharpInstance = sharpInstance.grayscale();
    }

    // Apply filters if specified - sepia
    if (filters.sepia) {
        sharpInstance = sharpInstance.tint({
            r: 112, //R: 112, G: 66, B: 20 , R: 255, G: 240, B: 16
            g: 66,
            b: 20
        });
    }

    // Convert the image format if specified
    if (format) {
        sharpInstance = sharpInstance.toFormat(format);
    }

    await sharpInstance.toFile(filePath);

    // Delete the original image from S3
    const response = await deleteFileFromAws(originalFile);
    if (response?.status !== "success") {
        throw new AppError("Failed to delete original image from S3", 500);
    }

    // Upload the transformed image to AWS S3
    const fileUrl = await uploadFileToAws(`${fileName}.${fileExtension}`, filePath)
    const newImageData = await Image.findByIdAndUpdate(imageId, { $set: { imageFile: fileUrl!.url } }, { new: true });

    logger.info("Successfully executed imageTransformController");
    res.status(200).json(new ApiResponse({ image: newImageData.imageFile, owner: image.owner }, "Image transformed successfully", 200));
});

export default imageTransformController;