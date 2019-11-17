import { Router } from 'express';
import { GetAllCategories } from '../controllers/CategoryController';

export const CategoryRoutes = Router();

CategoryRoutes.get('/get', GetAllCategories);
