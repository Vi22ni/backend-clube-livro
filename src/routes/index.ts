import express from 'express';
import peopleRouter from './peopleRoutes'
import booksRouter from './booksRoutes'
import authRouter from './authRoutes'

const router = express.Router();
router.use('/people', peopleRouter);
router.use('/books', booksRouter);
router.use('/auth', authRouter);

export default router;