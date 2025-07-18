import { S3Client, S3ClientConfig, PutObjectCommand, GetObjectCommand, HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from 'fs';
import mime from 'mime-types';
import AppError from "@/utils/appError";
import { logger } from "@/config/logger";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
} as S3ClientConfig);

const uploadFileToAws = async (fileName: string, filePath: string) => {
    try {
        if (!filePath) return null;

        const contentType = mime.lookup(filePath);
        if (!contentType.startsWith('image/')) {
            throw new AppError('File must be an image', 400);
        };
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: fs.createReadStream(filePath),
            ContentType: contentType,
        })

        const data = await s3Client.send(command);
        logger.info("Image uploaded to AWS S3 successfully");
        // Generate a signed URL for the file
        // const url = await getFileUrlFromAws(fileName);

        // Construct url - This works because the bucket is public
        const url = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`

        fs.unlinkSync(filePath);
        logger.info("File deleted from local filesystem");
        return { message: "Image uploaded to AWS S3 successfully", status: "success", url };
    } catch (err) {
        fs.unlinkSync(filePath);
        logger.error("Error uploading image to AWS S3", err);
        return 'error';
    }
};

const getFileUrlFromAws = async (fileName: string, expireTime = null) => {
    try {
        // Check if the file is available in the AWS S3 bucket
        // const check = await isFileAvailableInAwsBucket(fileName);
        const check = true

        if (check) {
            // Create a GetObjectCommand to retrieve the file from S3
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileName,
            });

            // Generate a signed URL with expiration time if provided
            if (expireTime != null) {
                const url = await getSignedUrl(s3Client, command, { expiresIn: expireTime });
                return url;
            } else {
                // Generate a signed URL without expiration time
                const url = await getSignedUrl(s3Client, command);
                return url;
            }
        } else {
            // Return an error message if the file is not available in the bucket
            return "error";
        }
    } catch (err) {
        // Handle any errors that occur during the process
        console.log("error ::", err);
        return "error";
    }
};

const isFileAvailableInAwsBucket = async (fileName: string) => {
    try {
        // Check if the object exists
        await s3Client.send(new HeadObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
        }));

        // If the object exists, return true
        return true;
    } catch (err) {
        if (err.name === 'NotFound') {
            // File not found in AWS bucket, return false
            return false;
        } else {
            // Handle other errors
            return false;
        }
    }
};

const deleteFileFromAws = async (fileName: string) => {
    try {
        // Configure the parameters for the S3 upload
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
        };
        // Upload the file to S3
        await s3Client.send(new DeleteObjectCommand(uploadParams)).then((data) => {
        });

    } catch (err) {
        console.error('Error ', err);
        return 'error';
    }
};

const awsFolderName = 'images'


export { uploadFileToAws, awsFolderName, getFileUrlFromAws, isFileAvailableInAwsBucket, deleteFileFromAws }



export default s3Client;