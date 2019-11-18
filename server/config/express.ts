import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';

import config from './config';

import { CategoryRoutes } from '../routes/CategoryRoutes';
import { ServiceRoutes } from '../routes/ServiceRoutes';
import { UserRoutes } from '../routes/UserRoutes';

mongoose.connect(process.env.DB_URI || config.db.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

// initialize app
const app = express();

// enable request logging for development debugging
app.use(morgan('dev'));

// enable CORS
app.use(cors({origin: '*'}));

// body parsing middleware
app.use(bodyParser.json());

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
