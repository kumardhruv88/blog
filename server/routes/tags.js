import express from 'express';
import { getTags, getPopularTags, mergeTags, updateTag, deleteTag, getTagBySlug } from '../controllers/tagController.js';

const router = express.Router();

router.get('/', getTags);
router.get('/popular', getPopularTags);
router.get('/:slug', getTagBySlug);
router.put('/merge', mergeTags);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;
