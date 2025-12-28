import express from 'express';
import { getItinerary, generateItinerary } from '../controllers/itineraryController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:tripId', authenticateToken, getItinerary);
router.post('/generate/:tripId', authenticateToken, generateItinerary);

export default router;
