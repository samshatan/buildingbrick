import express from 'express';
import { getFeesConfig } from '../controllers/configController.js';

const router = express.Router();

router.get('/fees', getFeesConfig);

export default router;
