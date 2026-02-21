import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getPosts, getPostBySlug, createPost, deletePost, updatePost, incrementView, getRelatedPosts, getSearchSuggestions } from '../controllers/postController.js';


const router = express.Router();

// Public Routes
router.get('/', getPosts);
router.get('/suggestions', getSearchSuggestions);

router.get('/search', getPosts); // Aliased to getPosts which handles ?search
router.get('/user/:userId', getPosts); // Aliased to getPosts which handles ?author
router.get('/category/:categoryId', getPosts); // Aliased to getPosts which handles ?category
router.get('/tag/:tagId', getPosts); // Aliased to getPosts which handles ?tag

router.get('/:slug', getPostBySlug);
router.get('/:slug/related', getRelatedPosts);
router.post('/:id/view', incrementView);

import { postValidation } from '../middleware/validator.js';

// Protected Routes
router.post('/', requireAuth, postValidation, createPost);
router.put('/:id', requireAuth, postValidation, updatePost);
router.delete('/:id', requireAuth, deletePost);

export default router;

