import { Router } from 'express';
import { GetProfile, LoginUser, RegisterUser } from '../controllers/UserController';

export const UserRoutes = Router();

UserRoutes.post('/register', RegisterUser);
UserRoutes.post('/login', LoginUser);
UserRoutes.get('/profile', GetProfile);
