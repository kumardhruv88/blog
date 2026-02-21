import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

const router = express.Router();

router.get('/', getSettings);

// Protected (Admin)
router.put('/', updateSettings);

export default router;
