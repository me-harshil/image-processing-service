import { NextFunction, Request, Response } from "express";
import { authService } from "@/services";
import { logger } from "@/config/logger";
import catchAsync from "@/utils/catchAsync";
import AppError from "@/utils/appError";
import ApiResponse from "@/utils/ApiResponse";

const loginController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    logger.info("Started executing loginController");
    const { username, password } = req.body;
    if ([username, password].some(item => item.trim() === "")) {
        throw new AppError("Username or password cannot be empty", 400);
    }
    const response = await authService.loginService({ username, password });
    logger.info("Successfully executed loginController");
    const cookieOptions = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie("accessToken", response.accessToken, cookieOptions)
        .cookie("refreshToken", response.refreshToken, cookieOptions)
        .json(new ApiResponse(response.user, "User logged in successfully", 200));
})

export default loginController;