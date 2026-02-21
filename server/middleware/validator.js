import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};

export const postValidation = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 500 }),
  body('content').notEmpty().withMessage('Content is required'),
  body('status').optional().isIn(['draft', 'published', 'scheduled']),
  validate
];

export const commentValidation = [
  body('content').notEmpty().withMessage('Content is required'),
  body('post_id').notEmpty().withMessage('Post ID is required').isUUID(),
  validate
];

export const userUpdateValidation = [
  body('username').optional().isLength({ min: 3, max: 50 }),
  body('email').optional().isEmail(),
  validate
];
