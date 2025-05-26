import express from 'express';
import { signup, login, logout, updateProfile, checkAuth } from '../Controllers/authControllers.js'
import { protectRoute } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);

router.post('/signup', signup);

router.post('/logout', logout);

router.put('/update-profile', protectRoute, updateProfile)

router.get('/check', protectRoute, checkAuth)

export default router;