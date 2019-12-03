import { Router } from 'express';
import { HasCategoryAuthorization, IsAuthenticated } from '../controllers/UserController';
import { CreateCategory, DeleteCategory, GetAllCategories, GetSingleCategory, UpdateCategory, GetCategoryServices } from '../controllers/CategoryController';

export const CategoryRoutes = Router();

// Routes begin at /api/categories/
CategoryRoutes.get('/get', GetAllCategories);
CategoryRoutes.get('/:catid', GetSingleCategory);
CategoryRoutes.get('/:catid/services', GetCategoryServices);
CategoryRoutes.post('/new', IsAuthenticated, HasCategoryAuthorization(['administrator', 'create']), CreateCategory);
CategoryRoutes.post('/:catid', IsAuthenticated, HasCategoryAuthorization(['administrator', 'update']), UpdateCategory);
CategoryRoutes.delete('/:catid', IsAuthenticated, HasCategoryAuthorization(['administrator', 'delete']), DeleteCategory);
