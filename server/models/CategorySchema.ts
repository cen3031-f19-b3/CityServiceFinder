import mongoose, { Schema } from 'mongoose';

import { ObjectId } from 'mongodb';
import ICategory from './CategoryInterface';

const categorySchema = new Schema({
  name: {
    required: true,
    type: String
  },
  subcategory_of: {
    required: true,
    type: [ObjectId]
  },
  link: {
    required: true,
    type: String
  },
  img: {
    required: true,
    type: String
  }
});

export const CategoryModel = mongoose.model<ICategory>('Category', categorySchema);
