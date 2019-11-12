import { Request, Response } from 'express';
import { ServiceModel } from '../models/ServiceSchema';

export const GetAllServices = async (req: Request, res: Response) => {
    const services = await ServiceModel.find();
    res.send(services);
};
