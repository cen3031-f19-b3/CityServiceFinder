import { Request, Response } from 'express';
import passport from 'passport';
import { UserModel } from '../models/UserSchema';

export const RegisterUser = (req: Request, res: Response) => {
  UserModel.register(
    new UserModel({ email: req.body.email }),
    req.body.password,
    (error, topUser) => {
      if (error) {
        console.log(`Error registering user: ${error}`);
        return res.status(500).json({
          success: false
        });
      } else {
        passport.authenticate('local', (err, user, info) => {
          if (err) {
            console.log(`Error authenticating just-registered user: ${err}`);
            return res.status(500).json({
              success: false
            });
          }

          if (!user) {
            return res.status(401).json({
              success: false
            });
          }

          return res.json({
            success: true
          });
        })(req, res);
      }
    }
  );
};

export const LoginUser = (req: Request, res: Response) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.log(`Error authenticating user: ${err}`);
      return res.status(500).json({
        success: false
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false
      });
    }

    return res.json({
      success: true
    });
  })(req, res);
};
