import { Request, Response } from "express";
import { authService } from "@/services";
import { logger } from "@/config/logger";
import catchAsync from "@/utils/catchAsync";
import AppError from "@/utils/appError";
import ApiResponse from "@/utils/ApiResponse";

const signupController = catchAsync(async (req: Request, res: Response) => {

    logger.info("Started executing signupController");
    const { username, password } = req.body;
    if ([username, password].some(item => item.trim() === "")) {
        throw new AppError("Username or password cannot be empty", 400);
    }
    const response = await authService.signupService({ username, password });
    logger.info("Successfully executed signupController");
    const cookieOptions = {
        httpOnly: true,
        secure: true
    }
    return res.status(201)
        .cookie("accessToken", response.accessToken, cookieOptions)
        .cookie("refreshToken", response.refreshToken, cookieOptions)
        .json(new ApiResponse(response.user, "User created successfully", 201));
})

export default signupController;