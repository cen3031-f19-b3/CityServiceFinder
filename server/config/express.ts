import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import passportLocal from 'passport-local';
import path from 'path';

import config from './config';

import { CategoryRoutes } from '../routes/CategoryRoutes';
import { ServiceRoutes } from '../routes/ServiceRoutes';
import { UserRoutes } from '../routes/UserRoutes';

import { UserModel } from '../models/UserSchema';

import connectMongo from 'connect-mongo';
const MongoStore = connectMongo(session);

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err, user) => {
      done(err, user);
  });
});

/**
 *  Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  UserModel.findOne({ email: email.toLowerCase() }, (err, user: any) => {
      if (err) { return done(err); }
      if (!user) {
          return done(undefined, false, { message: `Email ${email} not found.` });
      }
      user.comparePassword(password, (error: Error, isMatch: boolean) => {
          if (error) { return done(error); }
          if (isMatch) {
              return done(undefined, user);
          }
          return done(undefined, false, { message: 'Invalid email or password.' });
      });
  });
}));

// initialize app
const app = express();

mongoose.connect(process.env.DB_URI || config.db.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const db = mongoose.connection;

// enable request logging for development debugging
app.use(morgan('dev'));

// enable CORS
app.use(cors({credentials: true, origin: ['http://localhost:3000', 'http://localhost:5000']}));

// app.use(cookieParser());

// body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// tslint:disable: object-literal-sort-keys
app.use(session({
  secret: 'secret_session2',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
  },
  store: new MongoStore({mongooseConnection: db}),
}));

// These have to be used before the routes are setup
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use('/api/services', ServiceRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/users', UserRoutes);

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../../../client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../client/build', 'index.html'));
  });
}

export default app;
