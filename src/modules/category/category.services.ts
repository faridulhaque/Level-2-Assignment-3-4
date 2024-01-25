import { Request, Response } from "express";
import { categoryModel } from "./category.model";
import httpStatus from "http-status";

// service function for create a category.
export const createCategoryService = async (data: any) => {
  const response = await categoryModel.create(data);
  return response;
};

// service function to get all categories
export const getCategoriesService = async () => {
  const response = await categoryModel
    .find()
    .select({
      _id: 1,
      name: 1,
    })
    .populate({
      path: "createdBy",
      model: "User",
      select: "username email _id role",
    });
  return response;
};
