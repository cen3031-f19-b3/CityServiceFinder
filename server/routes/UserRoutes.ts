import { Router } from 'express';
import { RegisterUser } from '../controllers/UserController';

export const UserRoutes = Router();

UserRoutes.post('/create', RegisterUser);
