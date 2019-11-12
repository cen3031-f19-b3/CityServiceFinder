import mongoose, { Schema } from 'mongoose';

import { ObjectId } from 'mongodb';
import ICategory from './CategoryInterface';

const categorySchema = new Schema({
  name: {
    required: true,
    type: String
  },
  subcategory_of: ObjectId
});

export default mongoose.model<ICategory>('Category', categorySchema);
