import { Router } from "express";
import { changePasswordController, registerUserController, userLoginController } from "../modules/user/user.controller";

export const authRoutes = Router()

authRoutes.post("/register", registerUserController)
authRoutes.post("/login", userLoginController)
authRoutes.post("/change-password", changePasswordController)