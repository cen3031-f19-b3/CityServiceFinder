import { Router } from 'express';
import { CreateService, DeleteService, GetAllServices, GetSingleService, UpdateService } from '../controllers/ServiceController';

export const ServiceRoutes = Router();

ServiceRoutes.get('/get', GetAllServices);
ServiceRoutes.get('/:serviceid', GetSingleService);
ServiceRoutes.post('/new', CreateService);
ServiceRoutes.post('/:serviceid', UpdateService);
ServiceRoutes.delete('/:serviceid', DeleteService);
