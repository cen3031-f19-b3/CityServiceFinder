import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { IAuthorization, IUser } from '../models/UserInterface';
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
    return res.status(200).json({loggedIn: true, email: user.email, roles: user.authorizations, _id: user._id});
  } else {
    return res.status(401).json({loggedIn: false});
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
  return res.status(401).json({loggedIn: false});
};

export const IsAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({loggedIn: false});
  }

  const user = req.user as IUser;

  const hasAdmin = user.authorizations.find((auth) => auth.action === 'administrator' && auth.context === '/');

  if (hasAdmin) {
    next();
  }

  return res.sendStatus(403);
};

export const HasContextualAuthorization = (action: String, context: String) => async (req: Request, res: Response, next: NextFunction) => {
  if(!req.isAuthenticated()) {
    return res.status(401).json({loggedIn: false});
  }

  const user = req.user as IUser;

  const hasAdmin = user.authorizations.find((auth) => auth.action === 'administrator' && auth.context === '/');
  const authorized = hasAdmin || user.authorizations.find((auth) => 
    auth.action === action && context.substring(0, auth.context.length) === auth.context
  );

  if(authorized){
    next();
  }else{
    return res.sendStatus(403);
  }
}

export const GetCurrentUserRoles = (req: Request, res: Response) => {
  return res.send((req.user as IUser).authorizations);
};

export const GetUserRoles = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({_id: req.params.id});

  if (user) {
    return res.send(user.authorizations);
  } else {
    return res.sendStatus(404);
  }
};

export const AddUserRole = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({email: req.params.email});

  const action: string = req.body.action;
  const context: string = req.body.context;

  if (user.authorizations.find((auth) => auth.action === action && auth.context === context)) {
    return res.status(200).json(user.authorizations);
  } else {
    user.authorizations.push({action, context} as IAuthorization);
    await user.save();
    return res.status(200).json(user.authorizations);
  }
};

export const RemoveUserRole = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({email: req.params.email});

  const action: string = req.body.action;
  const context: string = req.body.context;

  user.authorizations = user.authorizations.filter((auth) => auth.action !== action && auth.context !== context);
  await user.save();
  return res.status(200).json(user.authorizations);
};