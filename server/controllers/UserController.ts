import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { IAuthorization, IUser } from '../models/UserInterface';
import { UserModel } from '../models/UserSchema';

/* Checks whether a user is authorized to perform a certain action within a certain context.
 * See the comments for HasContextualAuthorization(), below, for more information.
 */
export const check_auth = (user: IUser, action: String, context: String) => {
  return user.authorizations.find((auth) => 
    (auth.action === action && context.substring(0, auth.context.length) === auth.context)
    || (auth.action === 'administrator' && auth.context === '/'));
};

/* Attempts to register a new user
 * 
 * Routes to this controller should be protected to users with create@/users
 * A user can assign permissions to users they create; however, they can only
 * authorize these created users to take actions they can already take.
 *  
 * Responds 403 FORBIDDEN if the user attempts to create another user with higher
 * permissions than the former has.
 * 
 * Responds 409 CONFLICT if the user attempts to create an account with an email
 * address which is already in use.
 */
export const RegisterUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const creating_user = req.user as IUser;
  console.dir({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  });

  if(req.body.roles){
    let bad_auth: any[] = [];
    req.body.roles.forEach((auth: any) => {
      if(!check_auth(creating_user, auth.action, auth.context)){
        bad_auth.push(auth);
      }
    });

    if(bad_auth.length > 0){
      return res.status(403).json({bad_auth: bad_auth})
    }
  }

  const user = new UserModel({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    authorizations: (req.body.roles) ? req.body.roles.map((auth: any) => {
      return {
        action: auth.action,
        context: auth.context
      }
    }) : []
  });

  UserModel.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      return res.sendStatus(409);
    }
    user.save((errr) => {
      if (errr) {
        return next(errr);
      }
      res.sendStatus(200);
    });
  });
};

/* Attempts to authenticate a user.
 * 
 * Responds 200 OK if the authentication is successful,
 * or 401 UNAUTHORIZED if the authentication failed.
 */
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
      return res.sendStatus(401);
    }
    req.logIn(user, (errr) => {
      if (errr) {
        return next(errr);
      }
      res.status(200).json({ success: true });
    });
  })(req, res, next);
};

/* Logs out a user
 *
 * Routes leading to this controller should be restricted to logged-in users only
 * Redirects to "/" upon completion.
 */
export const LogoutUser = (req: Request, res: Response, next: NextFunction) => {
  req.logout();
  res.redirect("/");
}

/* Retrieves information about the currently logged-in user.
 *
 * Responds with status code 401 if the user is not logged in.
 */
export const GetProfile = (req: Request, res: Response, next: any) => {
  if (req.isAuthenticated()) {
    const user = req.user as IUser;
    return res.status(200).json({loggedIn: true, email: user.email, name: user.name, roles: user.authorizations, _id: user._id});
  } else {
    return res.status(401).json({loggedIn: false});
  }
};

/* Retrieves information about an arbitrary user.
 *
 * Routes to this controller should be protected to logged-in users with edit@/users/:id authorization
 *
 * Returns 404 NOT FOUND if the requested user does not exist, or 200 OK if the user was found.
 */
export const GetUserProfile = async (req: Request, res: Response, next: any) => {
  const user = await UserModel.findById(req.params.id);

  if(!user){
    return res.sendStatus(404);
  }else{
    return res.status(200).json({
      email: user.email,
      name: user.name,
      roles: user.authorizations,
      _id: user.id
    });
  }
}

/* Middleware to check if a user is authenticated.
 * 
 * Responds with status code 401 if the user is not logged in.
 */
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

/* Shorthand middleware to check if a user is an admin. 
 * 
 * Responds 401 UNAUTHORIZED if the user is not logged in, or
 * 403 FORBIDDEN if the user is logged in but not an admin.
 */ 
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

/* Middleware to check if a user has a certain authorization.
 *
 * Authorizations are in the form of {action, context} (often abbreviated action@context in this documentation)
 * 
 * `action` is a string representing the operation in question (for example, "create", "edit", "delete")
 * `context` is a string representing where the operation may be taken (for example, "/users", "/cat/5dc659b661ba1a6fab712efc", etc)
 * 
 * Permission contexts are recursive - that is, granting a user edit@/cat would also allow them to edit any category or subcategory.
 * The permission administrator@/ is special, bypassing all permission checks.
 */
export const HasContextualAuthorization = (action: String, context: String) => async (req: Request, res: Response, next: NextFunction) => {
  if(!req.isAuthenticated()) {
    return res.status(401).json({loggedIn: false});
  }

  const user = req.user as IUser;

  if(check_auth(user, action, context)){
    next();
  }else{
    return res.sendStatus(403);
  }
}

/* Retrieves all roles for the currently logged-in user. 
 * 
 * Routes using this controller should be restricted to logged-in users only.
 */
export const GetCurrentUserRoles = (req: Request, res: Response) => {
  return res.send((req.user as IUser).authorizations);
};

/* Retrieves all roles for an arbitrary user, by user ID
 * 
 * Routes using this controller should be restricted to logged-in users with the authorization edit@/users/:id
 * (where :id represents the user-id of the user to be looked up)
 */
export const GetUserRoles = async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.params.id);

  if (user) {
    return res.send(user.authorizations);
  } else {
    return res.sendStatus(404);
  }
};

/* Returns a list of all users which the current user can edit.
 * 
 * Responds 401 UNAUTHORIZED if the user is not logged in,
 * 403 FORBIDDEN if the user is authorized but cannot edit any users,
 * and 200 OK if the user can edit at least one other user (along with the list of users).
 */
export const ListUsers = async (req: Request, res: Response) => {
  if(!req.isAuthenticated()) {
    return res.status(401).json({loggedIn: false});
  }

  const user = req.user as IUser;

  const all_users = await UserModel.find();

  const filtered_users = all_users.filter((usr) => {
    return check_auth(user, "edit", `/users/${usr._id}`)
  }).map((usr) => {
    return {
      _id: usr._id,
      name: usr.name,
      email: usr.email,
      roles: usr.authorizations
    }
  })

  if(!filtered_users){
    return res.sendStatus(403);
  }else{
    return res.status(200).json(filtered_users);
  }
};

/* Attempts to update a user entry
 * 
 * Routes leading to this controller should be restricted to users with edit@/users/:id
 * authorization.
 * 
 * Returns 409 CONFLICT if the user attempts to change their email to one which is already in use,
 * 403 FORBIDDEN if the user attempts to give another user greater permissions than the former has,
 * 404 NOT FOUND if the requested user does not exist, and
 * 200 OK if the update was successful.
 */
export const UpdateUser = async (req: Request, res: Response, next: NextFunction) => {
  const to_update = await UserModel.findById(req.params.id);

  if(!to_update){
    return res.sendStatus(404)
  }

  const creating_user = req.user as IUser;

  if(req.body.name){
    to_update.name = req.body.name;
  }

  if(req.body.email){
    const conflicting_users = await UserModel.find({email: req.body.email})
    if(conflicting_users && conflicting_users.filter((itm) => {itm._id !== to_update._id}).length !== 0){
      return res.sendStatus(409);
    }else{
      to_update.email = req.body.email;
    }
  }

  if(req.body.roles){
    let bad_auth: any[] = [];
    req.body.roles.forEach((auth: any) => {
      if(!check_auth(creating_user, auth.action, auth.context)){
        bad_auth.push(auth);
      }
    });

    if(bad_auth.length !== 0){
      return res.status(403).json({bad_auth: bad_auth});
    }else{
      to_update.authorizations = req.body.roles
    }
  }

  if(req.body.password){
    to_update.password = req.body.password;
  }

  to_update.save((errr) => {
    if (errr) {
      return next(errr);
    }
    return res.status(200).json({
      name: to_update.name,
      email: to_update.email,
      roles: to_update.authorizations,
      _id: to_update._id
    });
  });

}

/* Attempts to delete a user from the database.
 *
 * Routes to this controller should be restricted to logged-in users with delete@/users/:id permissions.
 * 
 * Responds 404 if no such user exists, or 200 if the delete operation was successful.
 */
export const DeleteUser = async (req: Request, res: Response) => {
  UserModel.findByIdAndDelete(req.params.id)
    .then((removed) => {
      if(removed){
        res.sendStatus(200);
      }else{
        res.sendStatus(404);
      }
    })
}

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

