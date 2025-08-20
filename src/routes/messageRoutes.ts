import express from "express";
import messageController from "../controllers/messageController";
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, messageController.create);
router.patch('/:id', authenticateToken, messageController.update);
router.get('/:id', authenticateToken, messageController.getById);
router.get('/', authenticateToken, messageController.listAll);
router.delete('/:id', authenticateToken, messageController.delete);
router.get('/chat/:chat_id', authenticateToken, messageController.getByChatId);
router.get('/person/:person_id', authenticateToken, messageController.getByPersonId);

export default router;