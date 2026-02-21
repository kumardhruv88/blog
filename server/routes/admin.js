import express from 'express';
// import { requireAuth, requireAdmin } from '../middleware/auth.js'; 
import { 
    getAdminStats, getAdminUsers, getActivityLogs, banUser, updateUserRole, 
    approveComment, markCommentSpam, updatePostStatus, getAdminPosts, 
    deleteUserByAdmin, getAdminComments, getGlobalAnalytics 
} from '../controllers/adminController.js';

const router = express.Router();

// Protected (Admin Only)
router.get('/dashboard', getAdminStats);
router.get('/stats', getAdminStats); // Alias
router.get('/posts', getAdminPosts);
router.put('/posts/:id/status', updatePostStatus);

router.get('/users', getAdminUsers);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUserByAdmin);

router.get('/comments', getAdminComments);
router.put('/comments/:id/approve', approveComment);
router.put('/comments/:id/spam', markCommentSpam);

router.get('/analytics', getGlobalAnalytics);
router.get('/logs', getActivityLogs);

export default router;
