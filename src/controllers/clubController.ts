import { Request, Response } from 'express';
import Club from '../models/Club';
import People from '../models/People';
import Book from '../models/Book';

interface PaginationQuery {
    page?: string;
    size?: string;
}

class ClubController {
    async create(req: Request, res: Response) {
        try {
            const { name, description, current_book_id, creator_id } = req.body;

            const newClub = await Club.create({
                name,
                description,
                current_book_id,
                creator_id
            });

            return res.status(201).json(newClub);
        } catch (error) {
            console.error('Erro ao criar clube:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, description, current_book_id } = req.body;

            const club = await Club.findOne({ where: { id, deleted_at: null } });
            if (!club) {
                return res.status(404).json({ error: 'clube não encontrado' });
            }

            const updatedClub = await club.update({
                name: name || club.name,
                description: description !== undefined ? description : club.description,
                current_book_id: current_book_id !== undefined ? current_book_id : club.current_book_id
            });

            return res.json(updatedClub.toJSON());
        } catch (error) {
            console.error('Erro ao atualizar clube:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const club = await Club.findOne({ where: { id, deleted_at: null } });
            if (!club) {
                return res.status(404).json({ error: 'clube não encontrado' });
            }

            await club.destroy();

            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar clube:', error);
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

            const { count, rows: clubs } = await Club.findAndCountAll({
                where: { deleted_at: null },
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['created_at', 'DESC']],
                include: [
                    { model: People, as: 'creator', attributes: ['id', 'name'] },
                    { model: Book, as: 'currentBook', attributes: ['id', 'title'] }
                ]
            });

            return res.status(200).json({
                data: clubs,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao listar clubes:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const club = await Club.findOne({
                where: { id, deleted_at: null },
                include: [
                    { model: People, as: 'creator', attributes: ['id', 'name'] },
                    { model: Book, as: 'currentBook', attributes: ['id', 'title'] }
                ]
            });

            if (!club) {
                return res.status(404).json({ error: 'clube não encontrado' });
            }

            return res.json(club);
        } catch (error) {
            console.error('Erro ao buscar clube:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getByCreatorId(req: Request<{ creator_id: string }, {}, {}, PaginationQuery>, res: Response) {
        try {
            const { creator_id } = req.params;
            const { page = '1', size = '10' } = req.query;
            const pageNum = parseInt(page);
            const sizeNum = parseInt(size);

            if (isNaN(pageNum) || isNaN(sizeNum) || pageNum < 1 || sizeNum < 1) {
                return res.status(400).json({ error: 'Parâmetros de paginação inválidos' });
            }

            const { count, rows: clubs } = await Club.findAndCountAll({
                where: { creator_id, deleted_at: null },
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['created_at', 'DESC']],
                include: [
                    { model: People, as: 'creator', attributes: ['id', 'name'] },
                    { model: Book, as: 'currentBook', attributes: ['id', 'title'] }
                ]
            });

            return res.status(200).json({
                data: clubs,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao buscar clubes por creator_id:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getByCurrentBookId(req: Request<{ current_book_id: string }, {}, {}, PaginationQuery>, res: Response) {
        try {
            const { current_book_id } = req.params;
            const { page = '1', size = '10' } = req.query;
            const pageNum = parseInt(page);
            const sizeNum = parseInt(size);

            if (isNaN(pageNum) || isNaN(sizeNum) || pageNum < 1 || sizeNum < 1) {
                return res.status(400).json({ error: 'Parâmetros de paginação inválidos' });
            }

            const { count, rows: clubs } = await Club.findAndCountAll({
                where: { current_book_id, deleted_at: null },
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['created_at', 'DESC']],
                include: [
                    { model: People, as: 'creator', attributes: ['id', 'name'] },
                    { model: Book, as: 'currentBook', attributes: ['id', 'title'] }
                ]
            });

            return res.status(200).json({
                data: clubs,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao buscar clubes por current_book_id:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default new ClubController();