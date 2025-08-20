import express from "express";
import chatController from "../controllers/chatController";
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, chatController.create);
router.patch('/:id', authenticateToken, chatController.update);
router.get('/:id', authenticateToken, chatController.getById);
router.get('/', authenticateToken, chatController.listAll);
router.delete('/:id', authenticateToken, chatController.delete);
router.get('/club/:club_id', authenticateToken, chatController.getByClubId);