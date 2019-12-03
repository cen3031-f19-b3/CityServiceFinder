import { Router } from 'express';
import { CreateService, DeleteService, GetAllServices, GetSingleService, UpdateService } from '../controllers/ServiceController';
import { IsAuthenticated, HasContextualAuthorization } from '../controllers/UserController';

export const ServiceRoutes = Router();

ServiceRoutes.get('/get', GetAllServices);
ServiceRoutes.get('/:serviceid', GetSingleService);
ServiceRoutes.post('/new', IsAuthenticated, (req, res, next) => HasContextualAuthorization("create", "/services")(req, res, next), CreateService);
ServiceRoutes.post('/:serviceid', IsAuthenticated, (req, res, next) => HasContextualAuthorization("edit", `/services/${req.params.serviceid}`)(req, res, next), UpdateService);
ServiceRoutes.delete('/:serviceid', IsAuthenticated, (req, res, next) => HasContextualAuthorization("delete", `/services/${req.params.serviceid}`)(req, res, next), DeleteService);
