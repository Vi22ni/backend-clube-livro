import express from "express";
import tagsController from "../controllers/tagsController";
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();
router.post('/', authenticateToken, tagsController.create);
router.get('/search/:term', authenticateToken, tagsController.searchTags);
router.get('/:id', authenticateToken, tagsController.getById);
router.get('/', authenticateToken, tagsController.listAll);

export default router;