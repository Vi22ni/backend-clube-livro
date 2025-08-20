import { Request, Response } from 'express';
import ClubBookHistory from '../models/ClubBookHistory';
import Club from '../models/Club';
import Book from '../models/Book';

interface PaginationQuery {
    page?: string;
    size?: string;
}

class ClubBookHistoryController {
    async create(req: Request, res: Response) {
        try {
            const { club_id, book_id, started_at, finished_at, notes } = req.body;

            const newHistory = await ClubBookHistory.create({
                club_id,
                book_id,
                started_at,
                finished_at,
                notes
            });

            return res.status(201).json(newHistory);
        } catch (error) {
            console.error('Erro ao criar histórico:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { started_at, finished_at, notes } = req.body;

            const history = await ClubBookHistory.findOne({ where: { id } });
            if (!history) {
                return res.status(404).json({ error: 'histórico não encontrado' });
            }

            const updatedHistory = await history.update({
                started_at: started_at !== undefined ? started_at : history.started_at,
                finished_at: finished_at !== undefined ? finished_at : history.finished_at,
                notes: notes !== undefined ? notes : history.notes
            });

            return res.json(updatedHistory.toJSON());
        } catch (error) {
            console.error('Erro ao atualizar histórico:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const history = await ClubBookHistory.findOne({ where: { id } });
            if (!history) {
                return res.status(404).json({ error: 'histórico não encontrado' });
            }

            await history.destroy();

            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar histórico:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async listAll(req: Request<{}, {}, {}, PaginationQuery>, res: Response) {
        try {
            const { page = '1', size = '10' } = req.query;
            const pageNum = parseInt(page);
            const sizeNum = parseInt(size);

            if (isNaN(pageNum) || isNaN(sizeNum) || pageNum < 1 || sizeNum < 1) {
                return res.status(400).json({ error: 'Parâmetros de paginação inválidos' });
            }

            const { count, rows: histories } = await ClubBookHistory.findAndCountAll({
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['started_at', 'DESC']],
                include: [
                    { model: Club, as: 'club', attributes: ['id', 'name'] },
                    { model: Book, as: 'book', attributes: ['id', 'title'] }
                ]
            });

            return res.status(200).json({
                data: histories,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao listar históricos:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const history = await ClubBookHistory.findOne({
                where: { id },
                include: [
                    { model: Club, as: 'club', attributes: ['id', 'name'] },
                    { model: Book, as: 'book', attributes: ['id', 'title'] }
                ]
            });

            if (!history) {
                return res.status(404).json({ error: 'histórico não encontrado' });
            }

            return res.json(history);
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getByClubId(req: Request<{ club_id: string }, {}, {}, PaginationQuery>, res: Response) {
        try {
            const { club_id } = req.params;
            const { page = '1', size = '10' } = req.query;
            const pageNum = parseInt(page);
            const sizeNum = parseInt(size);

            if (isNaN(pageNum) || isNaN(sizeNum) || pageNum < 1 || sizeNum < 1) {
                return res.status(400).json({ error: 'Parâmetros de paginação inválidos' });
            }

            const { count, rows: histories } = await ClubBookHistory.findAndCountAll({
                where: { club_id },
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['started_at', 'DESC']],
                include: [
                    { model: Club, as: 'club', attributes: ['id', 'name'] },
                    { model: Book, as: 'book', attributes: ['id', 'title'] }
                ]
            });

            return res.status(200).json({
                data: histories,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao buscar históricos por club_id:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getByBookId(req: Request<{ book_id: string }, {}, {}, PaginationQuery>, res: Response) {
        try {
            const { book_id } = req.params;
            const { page = '1', size = '10' } = req.query;
            const pageNum = parseInt(page);
            const sizeNum = parseInt(size);

            if (isNaN(pageNum) || isNaN(sizeNum) || pageNum < 1 || sizeNum < 1) {
                return res.status(400).json({ error: 'Parâmetros de paginação inválidos' });
            }

            const { count, rows: histories } = await ClubBookHistory.findAndCountAll({
                where: { book_id },
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['started_at', 'DESC']],
                include: [
                    { model: Club, as: 'club', attributes: ['id', 'name'] },
                    { model: Book, as: 'book', attributes: ['id', 'title'] }
                ]
            });

            return res.status(200).json({
                data: histories,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao buscar históricos por book_id:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default new ClubBookHistoryController();