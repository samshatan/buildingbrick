import express from 'express';
import { getMaterials, getMaterialById, seedMaterials } from '../controllers/materialController.js';

const router = express.Router();

router.route('/')
  .get(getMaterials);

router.route('/:id')
  .get(getMaterialById);

router.route('/seed')
  .post(seedMaterials);

export default router;
