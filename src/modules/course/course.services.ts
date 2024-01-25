import { SessionOperation, SessionOption, startSession } from "mongoose";
import { ReviewModel } from "../review/review.model";
import { TCourse, TTags } from "./course.interfaces";
import { courseModel } from "./course.model";
import httpStatus from "http-status";
import AppError from "../../errorHandlers/appError";
import { UserModel } from "../user/user.model";

// service function for create a course

export const createCourseService = async (data: TCourse) => {
  const response = await courseModel.create(data);
  return response;
};

export const getBestCourseService = async () => {
  const response = await ReviewModel.aggregate([
    {
      $group: {
        _id: "$courseId",
        reviewCount: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
    {
      $sort: { averageRating: -1 },
    },
    {
      $limit: 1,
    },
    {
      $project: {
        _id: 0,
        courseId: "$_id",
        reviewCount: 1,
        averageRating: 1,
      },
    },
  ]);

  if (response?.length) {
    const courseId = response[0]?.courseId;
    const averageRating = response[0]?.averageRating;
    const reviewCount = response[0]?.reviewCount;

    const course = await courseModel
      .findOne({ _id: courseId })
      .select({
        _id: 1,
        title: 1,
        instructor: 1,
        categoryId: 1,
        price: 1,
        "tags.name": 1,
        "tags.isDeleted": 1,
        startDate: 1,
        endDate: 1,
        language: 1,
        provider: 1,
        durationInWeeks: 1,
        "details.level": 1,
        "details.description": 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .populate({
        path: "createdBy",
        model: "User",
        select: "username email _id role",
      });

    const data = {
      course,
      averageRating,
      reviewCount,
    };
    return data;
  }

  return null;
};

// service function for updating a course partially/dynamically
export const updateCourseService = async (
  id: string,
  value: Partial<TCourse>
) => {
  const { details, tags, ...others } = value;

  const session = await startSession();

  try {
    session.startTransaction();

    try {
      await courseModel.findByIdAndUpdate(id, others, {
        session,
      });
    } catch (error) {
      await session.abortTransaction();
      throw new AppError("MONGO", error);
    }

    if (details) {
      try {
        await courseModel.findByIdAndUpdate(
          id,
          {
            "details.level": details.level,
            "details.description": details.description,
          },
          { session }
        );
      } catch (error) {
        await session.abortTransaction();
        throw new AppError("MONGO", error);
      }
    }

    if (tags?.length) {
      try {
        try {
          await courseModel.findOneAndUpdate(
            {
              _id: id,
            },
            {
              $addToSet: { tags: { $each: tags } },
            },
            { new: true, session }
          );
        } catch (error) {
          throw new AppError("MONGO", error);
        }
      } catch (error) {
        await session.abortTransaction();
        throw new AppError("MONGO", error);
      }
    }

    await session.commitTransaction();
    await session.endSession();

    const course = await courseModel
      .findOne({ _id: id })
      .select({
        _id: 1,
        title: 1,
        instructor: 1,
        categoryId: 1,
        price: 1,
        "tags.name": 1,
        "tags.isDeleted": 1,
        startDate: 1,
        endDate: 1,
        language: 1,
        provider: 1,
        durationInWeeks: 1,
        "details.level": 1,
        "details.description": 1,
        updatedAt: 1,
        createdAt: 1,
      })
      .populate({
        path: "createdBy",
        model: "User",
        select: "username email _id role",
      });

    return course;
  } catch (error) {
    throw new AppError("MONGO", error);
  }
};

// service function to get filtered course
export const getCoursesService = async (queries: any) => {
  const {
    page: NPage,
    limit: NLimit,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    tags,
    startDate,
    endDate,
    language,
    provider,
    durationInWeeks,
    level,
  } = queries;

  const query: any = {};

  const page = NPage ? parseInt(NPage) : 1;
  const limit = NLimit ? parseInt(NLimit) : 10;
  const skip = (page - 1) * limit;

  if (startDate && endDate) {
    const sd = new Date(startDate);
    const ed = new Date(endDate);
    query.startDate = { $gte: sd, $lte: ed };
  } else if (startDate) {
    const sd = new Date(startDate);
    query.startDate = { $gte: sd };
  } else if (endDate) {
    const ed = new Date(endDate);
    query.endDate = { $lte: ed };
  }

  if (maxPrice && minPrice) {
    query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  } else if (maxPrice) {
    query.price = { $lte: Number(maxPrice) };
  } else if (minPrice) {
    query.price = { $gte: Number(minPrice) };
  }

  if (language) {
    query.language = language;
  }

  if (provider) {
    query.provider = provider;
  }

  if (durationInWeeks) {
    query.durationInWeeks = Number(durationInWeeks);
  }

  if (level) {
    query["details.level"] = level;
  }

  if (tags) {
    query.tags = { $elemMatch: { name: tags } };
  }

  const courses = await courseModel
    .find(query)
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "createdBy",
      model: "User",
      select: "username email _id role",
    })
    .select({
      _id: 1,
      title: 1,
      instructor: 1,
      categoryId: 1,
      price: 1,
      "tags.name": 1,
      "tags.isDeleted": 1,
      startDate: 1,
      endDate: 1,
      language: 1,
      provider: 1,
      durationInWeeks: 1,
      "details.level": 1,
      "details.description": 1,
      createdBy: 1,
      createdAt: 1,
      updatedAt: 1,
    });

  const meta = {
    page,
    limit,
    total: courses?.length,
  };

  return { courses, meta };
};

//  a common function to use in different controllers and services
export const getOneCourseService = async (id: string) => {
  const response = await courseModel.findOne({ _id: id }).select({
    _id: 1,
    title: 1,
    instructor: 1,
    categoryId: 1,
    price: 1,
    "tags.name": 1,
    "tags.isDeleted": 1,
    startDate: 1,
    endDate: 1,
    language: 1,
    provider: 1,
    durationInWeeks: 1,
    "details.level": 1,
    "details.description": 1,
    updatedAt: 1,
    createdAt: 1,
    createdBy: 1,
  });

  return response;
};
