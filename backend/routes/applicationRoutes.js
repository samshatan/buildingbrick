import express from 'express';
import { submitApplication, getApplicationsByWorker, getApplicationsForRequest, acceptApplication, declineApplication } from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, submitApplication);
router.get('/worker/:workerId', protect, getApplicationsByWorker);
router.get('/request/:requestId', getApplicationsForRequest);
router.post('/:applicationId/accept', protect, acceptApplication);
router.post('/:applicationId/decline', protect, declineApplication);

export default router;
