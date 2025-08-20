import { Request, Response } from 'express';
import Chat from '../models/Chat';
import Club from '../models/Club';

interface PaginationQuery {
    page?: string;
    size?: string;
}

class ChatController {
    async create(req: Request, res: Response) {
        try {
            const { club_id, created_at } = req.body;

            const newChat = await Chat.create({
                club_id,
                created_at
            });

            return res.status(201).json(newChat);
        } catch (error) {
            console.error('Erro ao criar chat:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async update(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            const { club_id, created_at } = req.body;

            const chat = await Chat.findOne({ where: { id } });
            if (!chat) {
                return res.status(404).json({ error: 'chat não encontrado' });
            }

            const updatedChat = await chat.update({
                club_id: club_id !== undefined ? club_id : chat.club_id,
                created_at: created_at !== undefined ? created_at : chat.created_at
            });

            return res.json(updatedChat.toJSON());
        } catch (error) {
            console.error('Erro ao atualizar chat:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async delete(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;

            const chat = await Chat.findOne({ where: { id } });
            if (!chat) {
                return res.status(404).json({ error: 'chat não encontrado' });
            }

            await chat.destroy();

            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar chat:', error);
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

            const { count, rows: chats } = await Chat.findAndCountAll({
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['created_at', 'DESC']],
                include: [
                    { model: Club, as: 'club', attributes: ['id', 'name'] }
                ]
            });

            return res.status(200).json({
                data: chats,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao listar chats:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getById(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            const chat = await Chat.findOne({
                where: { id },
                include: [
                    { model: Club, as: 'club', attributes: ['id', 'name'] }
                ]
            });

            if (!chat) {
                return res.status(404).json({ error: 'chat não encontrado' });
            }

            return res.json(chat);
        } catch (error) {
            console.error('Erro ao buscar chat:', error);
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

            const { count, rows: chats } = await Chat.findAndCountAll({
                where: { club_id },
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['created_at', 'DESC']],
                include: [
                    { model: Club, as: 'club', attributes: ['id', 'name'] }
                ]
            });

            return res.status(200).json({
                data: chats,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao buscar chats por club_id:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default new ChatController();