import { Router } from 'express';
import {
    AddUserRole,
    GetCurrentUserRoles,
    GetProfile,
    GetUserRoles,
    IsAuthenticated,
    LoginUser,
    RegisterUser,
    RemoveUserRole,
    HasContextualAuthorization
} from '../controllers/UserController';

export const UserRoutes = Router();

UserRoutes.post('/register', (req, res, next) => HasContextualAuthorization("create", `/users/${req.params.id}`)(req, res, next), RegisterUser);
UserRoutes.post('/login', LoginUser);
UserRoutes.get('/profile', GetProfile);

UserRoutes.get('/roles', IsAuthenticated, GetCurrentUserRoles);
UserRoutes.get('/:id/roles', (req, res, next) => HasContextualAuthorization("read", `/users/${req.params.id}`)(req, res, next), GetUserRoles);
UserRoutes.post('/:id/roles', (req, res, next) => HasContextualAuthorization("administrator", `/users/${req.params.id}`)(req, res, next), AddUserRole);
UserRoutes.delete('/:id/roles', (req, res, next) => HasContextualAuthorization("administrator", `/users/${req.params.id}`), RemoveUserRole);
