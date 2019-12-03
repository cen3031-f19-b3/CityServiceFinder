import { Request, Response } from 'express';
import { ServiceModel } from '../models/ServiceSchema';
import { SendReportMessage } from '../util/mail';

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

export const ReportService = async (req: Request, res: Response) => {
  const service = await ServiceModel.findById(req.params.serviceid);

  SendReportMessage(`A user has reported the service with name: ${service.name}.\n
  Service ID: ${service.id}\n\n
  User Message: ${req.body.message}
  `).then(() => {
    return res.sendStatus(200);
  }, () => {
    return res.sendStatus(500);
  }).catch(() => {
    return res.sendStatus(500);
  });
};
