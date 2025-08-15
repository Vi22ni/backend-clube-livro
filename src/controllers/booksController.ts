import { Request, Response } from 'express';
import Books from '../models/Book';
import BookTag from '../models/BookTag';
import Tag from '../models/Tag';

interface PaginationQuery {
    page?: string;
    size?: string;
}


class BooksController {
    async create(req: Request, res: Response) {

        try {
            const { title, author, synopsis, publication_year, created_by_id, tags } = req.body;


            const newBook = await Books.create({
                title,
                author,
                synopsis,
                publication_year,
                created_by_id
            });

            const newTags: BookTag[] = [];

            tags.forEach(async (tag: any) => {
                newTags.push(await BookTag.create({ tag_id: tag.id, book_id: newBook.id }));
            });

            const bookWithTags = {
                ...newBook,
                tags: newTags
            }

            return res.status(201).json(bookWithTags);
        } catch (error) {
            console.error('Erro ao criar livro:', error);
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

            const { count, rows: books } = await Books.findAndCountAll({
                where: { deleted_at: null },
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['created_at', 'DESC']],
                include: [{ model: Tag, as: 'tags' }]
            });

            return res.status(200).json({
                data: books,
                pagination: {
                    currentPage: page,
                    pageSize: size,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao listar livros:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const book = await Books.findOne({
                where: { id, deleted_at: null },
                include: [{ model: Tag, as: 'tags' }]
            });

            if (!book) {
                return res.status(404).json({ error: 'livro não encontrado' });
            }

            return res.json(book);
        } catch (error) {
            console.error('Erro ao buscar livro:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async update(req: Request, res: Response) {

        try {
            const { id } = req.params;
            const { title, author, synopsis, publication_year } = req.body;

            const book = await Books.findOne({ where: { id, deleted_at: null } });
            if (!book) {
                return res.status(404).json({ error: 'livro não encontrado' });
            }

            const updatedBook = await book.update({
                title: title || book.title,
                author: author || book.author,
                synopsis: synopsis !== undefined ? synopsis : book.synopsis,
                publication_year: publication_year || book.publication_year
            });

            return res.json(updatedBook.toJSON());
        } catch (error) {
            console.error('Erro ao atualizar livro:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const book = await Books.findOne({ where: { id, deleted_at: null } });
            if (!book) {
                return res.status(404).json({ error: 'livro não encontrado' });
            }

            await book.destroy();

            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar livro:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getByTag(req: Request<{}, {}, {}, { tag: string } & PaginationQuery>, res: Response) {
        try {
            const { tag, page = '1', size = '10' } = req.query;
            const pageNum = parseInt(page);
            const sizeNum = parseInt(size);

            if (isNaN(pageNum) || isNaN(sizeNum) || pageNum < 1 || sizeNum < 1) {
                return res.status(400).json({ error: 'Parâmetros de paginação inválidos' });
            }

            if (!tag) {
                return res.status(400).json({ error: 'Parâmetro "tag" é obrigatório' });
            }


            const { count, rows: books } = await Books.findAndCountAll({
                include: [{
                    model: Tag,
                    as: 'tags',
                    where: {
                        name: tag
                    },
                    through: { attributes: [] }
                }],
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['created_at', 'DESC']],
                distinct: true
            });

            return res.json({
                data: books,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum)
                }
            });
        } catch (error) {
            console.error('Erro ao buscar livros por tag:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }


}

export default new BooksController();