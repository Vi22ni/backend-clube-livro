import express from "express";
import peopleController from "../controllers/peopleController";
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();
router.post('/', peopleController.create);
router.patch('/:id', authenticateToken, peopleController.update);
router.get('/:id', authenticateToken, peopleController.getById);
router.get('/', peopleController.listAll);
router.delete('/:id', authenticateToken, peopleController.delete);

export default router;