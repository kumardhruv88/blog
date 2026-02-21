import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getBookmarks, toggleBookmark } from '../controllers/bookmarkController.js';

const router = express.Router();

// Protected Routes
router.get('/', requireAuth, getBookmarks);
router.post('/:postId', requireAuth, toggleBookmark);

export default router;
