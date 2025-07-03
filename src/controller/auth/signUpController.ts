import { Request, Response } from "express";
import { authService } from "@/services";
import { logger } from "@/config/logger";
import catchAsync from "@/utils/catchAsync";

const signupController = catchAsync(async (req: Request, res: Response) => {

    logger.info("Started executing signupController");
    const { username, password } = req.body;
    const response = await authService.signupService({ username, password });
    res.status(200).json(response);
    logger.info("Successfully executed signupController");
})

export default signupController;