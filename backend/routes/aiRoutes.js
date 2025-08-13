import express from 'express';
import { chat, embed } from '../controllers/aiController.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post(
  '/chat',
  body('messages').isArray(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  chat
);

router.post('/embed', embed);

export default router;
