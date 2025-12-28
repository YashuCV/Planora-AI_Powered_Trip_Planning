import express from 'express';
import { getTrip, getTrips, createTrip, deleteTrip } from '../controllers/tripController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getTrips);
router.get('/:id', authenticateToken, getTrip);
router.post('/', authenticateToken, createTrip);
router.delete('/:id', authenticateToken, deleteTrip);

export default router;

