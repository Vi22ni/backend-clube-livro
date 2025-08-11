import express from 'express';
import peopleRouter from './peopleRoutes'
import authRouter from './authRoutes'

const router = express.Router();
router.use('/people', peopleRouter)
router.use('/auth', authRouter)

export default router;