// type declaration for category.

import { Types } from "mongoose";

export type TCategory = {
  name: String;
  createdBy: Types.ObjectId,
  
};
