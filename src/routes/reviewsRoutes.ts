import express from "express";
import reviewsController from "../controllers/reviewsController";
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();
router.post('/', authenticateToken, reviewsController.create);
router.patch('/:id', authenticateToken, reviewsController.update);
router.get('/:id', reviewsController.getById);
router.get('/book/:id', reviewsController.getByBook);
router.get('/', reviewsController.listAll);
router.delete('/:id', authenticateToken, reviewsController.delete);

export default router;