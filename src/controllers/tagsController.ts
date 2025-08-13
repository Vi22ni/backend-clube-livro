import { Request, Response } from 'express';
import Tag from '../models/Tag';

interface PaginationQuery {
    page?: string;
    size?: string;
}

class TagsController {
    async create(req: Request, res: Response) {

        try {
            const { name } = req.body;

            const newTag = await Tag.create({ name });

            return res.status(201).json(newTag);
        } catch (error) {
            console.log('Erro ao criar tag:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async listAll(req: Request<{}, {}, {}, PaginationQuery>, res: Response) {

        try {
            const page = parseInt(req.query.page || '1');
            const size = parseInt(req.query.size || '10');

            if (isNaN(page) || isNaN(size) || page < 1 || size < 1) {
                return res.status(400).json({ error: 'Parâmetros inválidos' });
            }

            const { count, rows: tags } = await Tag.findAndCountAll({
                limit: size,
                offset: (page - 1) * size,
                order: [['created_at', 'DESC']],
            })

            return res.status(200).json({
                data: tags,
                pagination: {
                    currentPage: page,
                    pageSize: size,
                    totalItems: count,
                    totalPages: Math.ceil(count / size)
                }
            });
        } catch (error) {
            console.error('Erro ao listar tags:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const book = await Tag.findOne({
                where: { id },
            });

            if (!book) {
                return res.status(404).json({ error: 'tag não encontrada' });
            }

            return res.json(book);
        } catch (error) {
            console.error('Erro ao buscar tag:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default TagsController;