import express from "express";
import clubMemberController from "../controllers/clubMemberController";
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, clubMemberController.create);
router.patch('/:club_id/:person_id', authenticateToken, clubMemberController.update);
router.get('/:club_id/:person_id', authenticateToken, clubMemberController.getById);
router.get('/', authenticateToken, clubMemberController.listAll);
router.delete('/:club_id/:person_id', authenticateToken, clubMemberController.delete);
router.get('/club/:club_id', authenticateToken, clubMemberController.getByClubId);
router.get('/person/:person_id', authenticateToken, clubMemberController.getByPersonId);

export default router;