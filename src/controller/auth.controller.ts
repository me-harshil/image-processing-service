import loginController from "@/controller/auth/loginController";
import signupController from "@/controller/auth/signUpController";
import logoutController from "@/controller/auth/logoutController";
import { Router } from "express";
import checkAuth from "@/middleware/checkAuth.middleware";

const authController = Router();

authController.post("/login", loginController);
authController.post("/signup", signupController);
authController.post("/logout", checkAuth, logoutController);

export default authController;