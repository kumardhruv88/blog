import express from 'express';
import { getOverviewStats, getPostAnalytics, getUserAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

// All require auth
router.get('/overview', getOverviewStats);
router.get('/posts/:postId', getPostAnalytics);
router.get('/user/:userId', getUserAnalytics);

export default router;
