import express from "express";
import booksController from "../controllers/booksController";
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();
router.post('/', authenticateToken, booksController.create);
router.patch('/:id', authenticateToken, booksController.update);
router.get('/:id', booksController.getById);
router.get('/', booksController.listAll);
router.delete('/:id', authenticateToken, booksController.delete);

export default router;