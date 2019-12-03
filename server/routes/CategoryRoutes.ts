import { Router } from 'express';
import { CreateCategory, GetAllCategories, GetSingleCategory, UpdateCategory, DeleteCategory } from '../controllers/CategoryController';

export const CategoryRoutes = Router();

// Routes begin at /api/categories/
CategoryRoutes.get('/get', GetAllCategories);
CategoryRoutes.get('/:catid', GetSingleCategory);
CategoryRoutes.post('/new', CreateCategory);
CategoryRoutes.post('/:catid', UpdateCategory);
CategoryRoutes.delete('/:catid', DeleteCategory)