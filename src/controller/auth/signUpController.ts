import { Request, Response } from "express";
import { authService } from "@/services";
import { logger } from "@/config/logger";
import catchAsync from "@/utils/catchAsync";

const signupController = catchAsync(async (req: Request, res: Response) => {

    logger.info("Started executing signupController");
    const { username, password } = req.body;
    const response = await authService.signupService({ username, password });
    logger.info("Successfully executed signupController");
    res.cookie('jwt', response.token);
    return res.status(200).json(response);
})

export default signupController;