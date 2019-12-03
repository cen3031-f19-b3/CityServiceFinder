import { Router } from 'express';
import {
    AddUserRole,
    GetCurrentUserRoles,
    GetProfile,
    GetUserRoles,
    IsAdmin,
    IsAuthenticated,
    LoginUser,
    RegisterUser,
    RemoveUserRole
} from '../controllers/UserController';

export const UserRoutes = Router();

UserRoutes.post('/register', RegisterUser);
UserRoutes.post('/login', LoginUser);
UserRoutes.get('/profile', GetProfile);

UserRoutes.get('/roles', IsAuthenticated, GetCurrentUserRoles);
UserRoutes.get('/:email/roles', IsAdmin, GetUserRoles);
UserRoutes.post('/:email/roles', IsAdmin, AddUserRole);
UserRoutes.delete('/:email/roles', IsAdmin, RemoveUserRole);
