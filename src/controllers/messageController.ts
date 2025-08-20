import { Request, Response } from 'express';
import Message from '../models/Message';
import Chat from '../models/Chat';
import People from '../models/People';

interface PaginationQuery {
    page?: string;
    size?: string;
}

class MessageController {
    async create(req: Request, res: Response) {
        try {
            const { chat_id, person_id, content, created_at } = req.body;

            const newMessage = await Message.create({
                chat_id,
                person_id,
                content,
                created_at
            });

            return res.status(201).json(newMessage);
        } catch (error) {
            console.error('Erro ao criar mensagem:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async update(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            const { content } = req.body;

            const message = await Message.findOne({ where: { id } });
            if (!message) {
                return res.status(404).json({ error: 'mensagem não encontrada' });
            }

            const updatedMessage = await message.update({
                content: content !== undefined ? content : message.content
            });

            return res.json(updatedMessage.toJSON());
        } catch (error) {
            console.error('Erro ao atualizar mensagem:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async delete(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;

            const message = await Message.findOne({ where: { id } });
            if (!message) {
                return res.status(404).json({ error: 'mensagem não encontrada' });
            }

            await message.destroy();

            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar mensagem:', error);
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

            const { count, rows: messages } = await Message.findAndCountAll({
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['created_at', 'ASC']],
                include: [
                    { model: Chat, as: 'chat', attributes: ['id', 'club_id'] },
                    { model: People, as: 'person', attributes: ['id', 'name'] }
                ]
            });

            return res.status(200).json({
                data: messages,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao listar mensagens:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getById(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            const message = await Message.findOne({
                where: { id },
                include: [
                    { model: Chat, as: 'chat', attributes: ['id', 'club_id'] },
                    { model: People, as: 'person', attributes: ['id', 'name'] }
                ]
            });

            if (!message) {
                return res.status(404).json({ error: 'mensagem não encontrada' });
            }

            return res.json(message);
        } catch (error) {
            console.error('Erro ao buscar mensagem:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getByChatId(req: Request<{ chat_id: string }, {}, {}, PaginationQuery>, res: Response) {
        try {
            const { chat_id } = req.params;
            const { page = '1', size = '10' } = req.query;
            const pageNum = parseInt(page);
            const sizeNum = parseInt(size);

            if (isNaN(pageNum) || isNaN(sizeNum) || pageNum < 1 || sizeNum < 1) {
                return res.status(400).json({ error: 'Parâmetros de paginação inválidos' });
            }

            const { count, rows: messages } = await Message.findAndCountAll({
                where: { chat_id },
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['created_at', 'DESC']],
                include: [
                    { model: People, as: 'person', attributes: ['id', 'name'] }
                ]
            });

            return res.status(200).json({
                data: messages,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao buscar mensagens por chat_id:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getByPersonId(req: Request<{ person_id: string }, {}, {}, PaginationQuery>, res: Response) {
        try {
            const { person_id } = req.params;
            const { page = '1', size = '10' } = req.query;
            const pageNum = parseInt(page);
            const sizeNum = parseInt(size);

            if (isNaN(pageNum) || isNaN(sizeNum) || pageNum < 1 || sizeNum < 1) {
                return res.status(400).json({ error: 'Parâmetros de paginação inválidos' });
            }

            const { count, rows: messages } = await Message.findAndCountAll({
                where: { person_id },
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['created_at', 'ASC']],
                include: [
                    { model: Chat, as: 'chat', attributes: ['id', 'club_id'] }
                ]
            });

            return res.status(200).json({
                data: messages,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao buscar mensagens por person_id:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default new MessageController();