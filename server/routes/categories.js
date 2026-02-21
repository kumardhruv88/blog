import express from 'express';
import { getCategories, getCategoryBySlug, createCategory, reorderCategories, deleteCategory, updateCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin Routes (Temporary open)
router.post('/', createCategory);
router.put('/reorder', reorderCategories);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
