import { Router } from 'express';
import { CreateService, DeleteService, GetAllServices, GetSingleService, UpdateService, ReportService } from '../controllers/ServiceController';
import { HasServiceAuthorization, IsAuthenticated } from '../controllers/UserController';

export const ServiceRoutes = Router();

ServiceRoutes.get('/get', GetAllServices);
ServiceRoutes.get('/:serviceid', GetSingleService);
ServiceRoutes.post('/new', IsAuthenticated, HasServiceAuthorization(['administrator', 'create']), CreateService);
ServiceRoutes.post('/:serviceid', IsAuthenticated, HasServiceAuthorization(['administrator', 'update']), UpdateService);
ServiceRoutes.delete('/:serviceid', IsAuthenticated, HasServiceAuthorization(['administrator', 'delete']), DeleteService);

ServiceRoutes.post('/:serviceid/report', ReportService);
