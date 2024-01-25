import { Router } from "express";
import { createCategoryController, getCategoriesController } from "../modules/category/category.controller";

export const categoryRoutes = Router();

categoryRoutes.post(
  "/",
  createCategoryController
);

categoryRoutes.get("/", getCategoriesController)