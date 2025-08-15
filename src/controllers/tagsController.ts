import { Request, Response } from 'express';
import Tag from '../models/Tag';
import { Op } from 'sequelize';

interface PaginationQuery {
    page?: string;
    size?: string;
}

/*
melhorias futuras:

    Cache: Implemente cache na camada de serviço para termos populares

    Stemming: Busque por radicais das palavras (ex: "fic" encontrar "ficção")

    Busca por prefixo: Adicione opção para buscar só no início das palavras

    Popularidade: Ordene também por frequência de uso das tags
*/

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
            const { page = '1', size = '10' } = req.query;
            const pageNum = parseInt(page);
            const sizeNum = parseInt(size);

            if (isNaN(pageNum) || isNaN(sizeNum) || pageNum < 1 || sizeNum < 1) {
                return res.status(400).json({ error: 'Parâmetros de paginação inválidos' });
            }

            const { count, rows: tags } = await Tag.findAndCountAll({
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['created_at', 'DESC']],
            })

            return res.status(200).json({
                data: tags,
                pagination: {
                    currentPage: page,
                    pageSize: size,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum)
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

    async searchTags(req: Request<{}, {}, {}, { term: string }>, res: Response) {
        try {
            const { term } = req.query;

            if (!term || term.trim().length < 2) {
                return res.status(400).json({
                    error: 'Termo de busca deve ter pelo menos 2 caracteres'
                });
            }

            const tags = await Tag.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${term}%`
                    }
                },
                limit: 10,
                order: [
                    ['name', 'ASC']
                ]
            });

            return res.json(tags);
        } catch (error) {
            console.error('Erro ao buscar tags:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default new TagsController();