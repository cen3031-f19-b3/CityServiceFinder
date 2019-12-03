import { Router } from 'express';
import { CreateCategory, DeleteCategory, GetAllCategories, GetSingleCategory, UpdateCategory, GetCategoryServices } from '../controllers/CategoryController';

export const CategoryRoutes = Router();

// Routes begin at /api/categories/
CategoryRoutes.get('/get', GetAllCategories);
CategoryRoutes.get('/:catid', GetSingleCategory);
CategoryRoutes.get('/:catid/services', GetCategoryServices);
CategoryRoutes.post('/new', CreateCategory);
CategoryRoutes.post('/:catid', UpdateCategory);
CategoryRoutes.delete('/:catid', DeleteCategory);
