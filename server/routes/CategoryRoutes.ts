import { Router } from 'express';
import { CreateCategory, DeleteCategory, GetAllCategories, GetSingleCategory, UpdateCategory } from '../controllers/CategoryController';
import { HasCategoryAuthorization, IsAuthenticated } from '../controllers/UserController';

export const CategoryRoutes = Router();

// Routes begin at /api/categories/
CategoryRoutes.get('/get', GetAllCategories);
CategoryRoutes.get('/:catid', GetSingleCategory);
CategoryRoutes.post('/new', IsAuthenticated, HasCategoryAuthorization(['administrator', 'create']), CreateCategory);
CategoryRoutes.post('/:catid', IsAuthenticated, HasCategoryAuthorization(['administrator', 'update']), UpdateCategory);
CategoryRoutes.delete('/:catid', IsAuthenticated, HasCategoryAuthorization(['administrator', 'delete']), DeleteCategory);
