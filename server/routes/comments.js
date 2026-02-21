import express from 'express';
// import { requireAuth } from '../middleware/auth.js';
import { getCommentsByPost, createComment, deleteComment, updateComment, likeComment, unlikeComment } from '../controllers/commentController.js';
import { commentValidation } from '../middleware/validator.js';

const router = express.Router();

router.get('/post/:postId', getCommentsByPost);

// Protected
// router.post('/', requireAuth, createComment);
// router.delete('/:id', requireAuth, deleteComment);

// Temporary Open
router.post('/', commentValidation, createComment);
router.put('/:id', commentValidation, updateComment);
router.delete('/:id', deleteComment);
router.post('/:id/like', likeComment);
router.delete('/:id/like', unlikeComment);

export default router;
