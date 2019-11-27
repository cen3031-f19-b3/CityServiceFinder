import { Router } from 'express';
import { LoginUser, RegisterUser } from '../controllers/UserController';

export const UserRoutes = Router();

UserRoutes.post('/register', RegisterUser);
UserRoutes.post('/login', LoginUser);
