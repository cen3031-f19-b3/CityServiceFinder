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
    HasContextualAuthorization,
    ListUsers,
    UpdateUser,
    DeleteUser,
    GetUserProfile,
    LogoutUser
} from '../controllers/UserController';

export const UserRoutes = Router();

UserRoutes.post('/register', (req, res, next) => HasContextualAuthorization("create", `/users`)(req, res, next), RegisterUser);
UserRoutes.post('/login', LoginUser);
UserRoutes.delete('/login', LogoutUser);
UserRoutes.get('/profile', GetProfile);

UserRoutes.get('/list', ListUsers)

UserRoutes.get('/roles', IsAuthenticated, GetCurrentUserRoles);
UserRoutes.get('/:id/roles', (req, res, next) => HasContextualAuthorization("read", `/users/${req.params.id}`)(req, res, next), GetUserRoles);
UserRoutes.post('/:id/roles', (req, res, next) => HasContextualAuthorization("administrator", `/users/${req.params.id}`)(req, res, next), AddUserRole);
UserRoutes.delete('/:id/roles', (req, res, next) => HasContextualAuthorization("administrator", `/users/${req.params.id}`)(req, res, next), RemoveUserRole);

UserRoutes.get('/:id', (req, res, next) => HasContextualAuthorization("edit", `/users/${req.params.id}`)(req, res, next), GetUserProfile);
UserRoutes.post('/:id', (req, res, next) => HasContextualAuthorization("edit", `/users/${req.params.id}`)(req, res, next), UpdateUser);
UserRoutes.delete('/:id', (req, res, next) => HasContextualAuthorization("delete", `/users/${req.params.id}`)(req, res, next), DeleteUser);