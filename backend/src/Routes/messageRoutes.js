import express from 'express';
import { protectRoute } from '../Middlewares/authMiddleware.js';
import { getMessages, getUsersForSidebar, sendMessage } from '../Controllers/messageControllers.js';

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar);
router.get('/:id', protectRoute, getMessages);

router.post('/send/:id', protectRoute, sendMessage);

export default router;