import { Router } from 'express';
import { IsAuthenticated, HasContextualAuthorization } from '../controllers/UserController';
import { CreateCategory, DeleteCategory, GetAllCategories, GetSingleCategory, UpdateCategory, GetCategoryServices, ReportCategory } from '../controllers/CategoryController';

export const CategoryRoutes = Router();

// Routes begin at /api/categories/
CategoryRoutes.get('/get', GetAllCategories);
CategoryRoutes.get('/:catid', GetSingleCategory);
CategoryRoutes.get('/:catid/services', GetCategoryServices);
CategoryRoutes.post('/new', IsAuthenticated, (req, res, next) => HasContextualAuthorization("create", `/categories`)(req, res, next), CreateCategory);
CategoryRoutes.post('/:catid', IsAuthenticated, (req, res, next) => HasContextualAuthorization("edit", `/categories/${req.params.catid}`)(req, res, next), UpdateCategory);
CategoryRoutes.delete('/:catid', IsAuthenticated, (req, res, next) => HasContextualAuthorization("delete", `/categories/${req.params.catid}`)(req, res, next), DeleteCategory);

CategoryRoutes.post('/:catid/report', ReportCategory);
