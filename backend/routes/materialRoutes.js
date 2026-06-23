import express from 'express';
import { getMaterials, seedMaterials } from '../controllers/materialController.js';

const router = express.Router();

router.route('/')
  .get(getMaterials);

router.route('/seed')
  .post(seedMaterials);

export default router;
