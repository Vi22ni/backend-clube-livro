import express from 'express';
import peopleRouter from './peopleRoutes'
import booksRouter from './booksRoutes'
import authRouter from './authRoutes'
import tagsRouter from './tagsRoutes'
import reviewsRouter from './reviewsRoutes';
import '../models';

const router = express.Router();
router.use('/people', peopleRouter);
router.use('/books', booksRouter);
router.use('/auth', authRouter);
router.use('/tags', tagsRouter);
router.use('/reviews', reviewsRouter);

export default router;