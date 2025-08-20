import express from "express";
import clubController from "../controllers/clubController";
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, clubController.create);
router.patch('/:id', authenticateToken, clubController.update);
router.get('/:id', authenticateToken, clubController.getById);
router.get('/', authenticateToken, clubController.listAll);
router.delete('/:id', authenticateToken, clubController.delete);
router.get('/creator/:creator_id', authenticateToken, clubController.getByCreatorId);
router.get('/current-book/:current_book_id', authenticateToken, clubController.getByCurrentBookId);

export default router;