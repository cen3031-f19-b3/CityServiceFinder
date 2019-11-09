import express from 'express';
import { hello } from '../controllers/examples.server.controller';

const router = express.Router();

router.route('/').get(hello);

export const routes = router;
