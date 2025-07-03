import express from 'express';
import { protectRoute } from '../Middlewares/authMiddleware.js';
import { handleAiReq } from '../Controllers/aiController.js';

const router = express.Router();

router.post("/send",protectRoute,handleAiReq);

export default router;