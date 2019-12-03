import { Request, Response } from 'express';
import { ServiceModel } from '../models/ServiceSchema';

export const GetAllServices = async (req: Request, res: Response) => {
  const services = await ServiceModel.find();
  res.send(services);
};

export const GetSingleService = async (req: Request, res: Response) => {
  const service = await ServiceModel.findById(req.params.serviceid).populate('categories');
  res.send(service);
};

export const DeleteService = async (req: Request, res: Response) => {
  ServiceModel.deleteOne(req.body.id, (err) => {
    if (err) {
      return res.sendStatus(400);
    }

    return res.sendStatus(200);
  });
};

export const CreateService = async (req: Request, res: Response) => {
  const service = new ServiceModel({
    ...req.body
  });

  const result = await service
    .save()
    .then((serv) => {
      return res.json(serv);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });

  return result;
};

export const UpdateService = async (req: Request, res: Response) => {
  ServiceModel.findByIdAndUpdate(
    req.body.id,
    { ...req.body.update },
    (err, serv) => {
      if (err) {
        return res.status(400).json(err);
      }

      return res.json(serv);
    }
  );
};
