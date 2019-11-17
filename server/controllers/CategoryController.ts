import {Request, Response} from 'express';
import { CategoryModel } from '../models/CategorySchema';

export const GetAllCategories = async (req: Request, res: Response) => {
  const categories = await CategoryModel.find();
  res.send(categories);
};
