import express from "express";
import clubBookHistoryController from "../controllers/clubBookHistoryController";
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, clubBookHistoryController.create);
router.patch('/:id', authenticateToken, clubBookHistoryController.update);
router.get('/:id', authenticateToken, clubBookHistoryController.getById);
router.get('/', authenticateToken, clubBookHistoryController.listAll);
router.delete('/:id', authenticateToken, clubBookHistoryController.delete);
router.get('/club/:club_id', authenticateToken, clubBookHistoryController.getByClubId);
router.get('/book/:book_id', authenticateToken, clubBookHistoryController.getByBookId);

export default router;