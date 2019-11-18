import { Request, Response } from 'express';
import passport = require('passport');
import { UserModel } from '../models/UserSchema';

export const RegisterUser = (req: Request, res: Response) => {
    UserModel.register(new UserModel({email: req.body.email}), req.body.password, (err, user) => {
        if (err) {
            console.log(`Error registering user: ${err}`);
            return res.redirect('./register');
        } else {
            passport.authenticate('local')(req, res, () => {
                // TODO Where do we send them?
                return res.redirect('/');
            });
        }
    });
};
