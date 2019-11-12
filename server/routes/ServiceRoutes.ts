import { Router } from 'express';
import { GetAllServices } from '../controllers/ServiceController';

export const ServiceRoutes = Router();

ServiceRoutes.get('/get', GetAllServices);
