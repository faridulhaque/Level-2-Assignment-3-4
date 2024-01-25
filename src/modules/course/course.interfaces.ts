import { Types } from "mongoose"


// all necessary types for course

export type TTags = {
    name: string,
    isDeleted: boolean
}

export type TDetails = {
    level: 'Beginner' | 'Advanced' | 'Intermediate',
    description: string,
}

export type TCourse = {
    title: string,
    instructor: string,
    categoryId: Types.ObjectId,
    price: number,
    tags: TTags[],
    startDate: Date,
    endDate: Date,
    language: string,
    provider: string,
    durationInWeeks: number,
    details: TDetails,
    createdBy: Types.ObjectId,
}

