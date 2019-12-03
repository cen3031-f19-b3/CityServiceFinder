import mongoose, { Schema } from 'mongoose';

import { ObjectId } from 'mongodb';
import ICategory from './CategoryInterface';

// tslint:disable: object-literal-sort-keys
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
    required: false,
    type: String
  },
  img: {
    required: false,
    type: String
  }
});

export const CategoryModel = mongoose.model<ICategory>('Category', categorySchema);
