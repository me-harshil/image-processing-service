import loginController from "@/controller/auth/loginController";
import signupController from "@/controller/auth/signUpController";
import {Router} from "express";

const authController = Router();

authController.post("/login", loginController);
authController.post("/signup", signupController);

export default authController;