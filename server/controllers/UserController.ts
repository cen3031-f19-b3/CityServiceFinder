import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { IUser } from '../models/UserInterface';
import { UserModel } from '../models/UserSchema';

export const RegisterUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.dir({
    email: req.body.email,
    password: req.body.password
  });
  const user = new UserModel({
    email: req.body.email,
    password: req.body.password
  });

  UserModel.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      return res.redirect('/signup');
    }
    user.save((errr) => {
      if (errr) {
        return next(errr);
      }
      req.logIn(user, (errrr) => {
        if (errrr) {
          return next(errrr);
        }
        res.redirect('/');
      });
    });
  });
};

export const LoginUser = (req: Request, res: Response, next: any) => {
  if (req.user) {
    req.logIn(req.user, (errr) => {
      if (errr) {
        return next(errr);
      }
      res.status(200).json({ success: true });
    });
    return;
  }

  passport.authenticate('local', (err: Error, user: IUser, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, (errr) => {
      if (errr) {
        return next(errr);
      }
      res.status(200).json({ success: true });
    });
  })(req, res, next);
};

export const GetProfile = (req: Request, res: Response, next: any) => {
  if (req.isAuthenticated()) {
    const user = req.user as IUser;
    return res.status(200).json({loggedIn: true, email: user.email});
  } else {
    return res.status(400).json({loggedIn: false});
  }
};

export const IsAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
