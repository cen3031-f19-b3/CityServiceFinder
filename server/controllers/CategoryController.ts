import { Request, Response } from 'express';
import { CategoryModel } from '../models/CategorySchema';

/**
 * A Route to retrieve all categories from the database.
 *
 * @param req {Request} the request object
 * @param res {Response} the response to the request
 */
export const GetAllCategories = async (req: Request, res: Response) => {
  const categories = await CategoryModel.find();
  res.send(categories);
};

export const GetSingleCategory = async (req: Request, res: Response) => {
  const category = await CategoryModel.findOne({_id: req.params.catid})
    .populate('subcategory_of');
  res.send(category);
}

export const DeleteCategory = async (req: Request, res: Response) => {
  CategoryModel.findOneAndRemove({_id: req.params.catid}, (err) => {
    if (err) {
      return res.sendStatus(400);
    }

    return res.sendStatus(200);
  });
};

export const CreateCategory = async (req: Request, res: Response) => {
  const category = new CategoryModel({
    ...req.body
  });

  const result = await category
    .save()
    .then((cat) => {
      return res.json(cat);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });

  return result;
};

export const UpdateCategory = async (req: Request, res: Response) => {
  CategoryModel.findByIdAndUpdate(
    req.params.catid,
    { ...req.body },
    (err, cat) => {
      if (err) {
        return res.status(400).json(err);
      }

      return res.json(cat);
    }
  );
};
