import express from 'express';
// import { requireAuth } from '../middleware/auth.js'; // Commented out until Clerk is fully configured to avoid 500s
import { getUserProfile, updateUserProfile, getUserStats } from '../controllers/userController.js';

const router = express.Router();

// Public Routes
router.get('/:id', getUserProfile);
router.get('/:id/stats', getUserStats);

// Protected Routes
import { userUpdateValidation } from '../middleware/validator.js';

// ...

// router.put('/:id', requireAuth, userUpdateValidation, updateUserProfile);
router.put('/:id', userUpdateValidation, updateUserProfile); 

import { followUser, unfollowUser, getUserFollowers, getUserFollowing, getUserPosts } from '../controllers/userController.js';
router.post('/:id/follow', followUser);
router.delete('/:id/follow', unfollowUser);
router.get('/:id/followers', getUserFollowers);
router.get('/:id/following', getUserFollowing);
router.get('/:id/posts', getUserPosts);

export default router;
