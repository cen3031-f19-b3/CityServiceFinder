import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';

import config from './config';

import { CategoryRoutes } from '../routes/CategoryRoutes';
import { ServiceRoutes } from '../routes/ServiceRoutes';
import { UserRoutes } from '../routes/UserRoutes';

// initialize app
const app = express();

// enable request logging for development debugging
app.use(morgan('dev'));

// enable CORS
app.use(cors({credentials: true, origin: ['http://localhost:3000', 'http://localhost:5000']}));

// body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

app.use(session({ secret: 'secret_session2', cookie: {secure: false} }));

// These have to be used before the routes are setup
app.use(passport.initialize());
app.use(passport.session());

import { UserModel } from '../models/UserSchema';

passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

mongoose.connect(process.env.DB_URI || config.db.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

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
