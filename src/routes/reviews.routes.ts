import { Router } from "express";
import { createReviewController } from "../modules/review/review.controller";

export const reviewsRoutes = Router()

reviewsRoutes.post("/", createReviewController)