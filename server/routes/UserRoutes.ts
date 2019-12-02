import { Router } from 'express';
import passport from 'passport';
import { LoginUser, RegisterUser, GetUsers } from '../controllers/UserController';

export const UserRoutes = Router();

UserRoutes.post('/register', RegisterUser);
UserRoutes.post('/login', LoginUser);
UserRoutes.get('/all', GetUsers);
