import { Request, Response } from 'express';
import Books from '../models/Book';
import { validationResult } from 'express-validator';

interface PaginationQuery {
    page?: string;
    size?: string;
}


class BooksController {
    async create(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { title, author, synopsis, publication_year, created_by_id } = req.body;

            const newBook = await Books.create({
                title,
                author,
                synopsis,
                publication_year,
                created_by_id
            });

            return res.status(201).json(newBook);
        } catch (error) {
            console.error('Erro ao criar livro:', error);
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

            const { count, rows: books } = await Books.findAndCountAll({
                where: { deleted_at: null },
                limit: size,
                offset: (page - 1) * size,
                order: [['created_at', 'DESC']]
            });

            return res.status(200).json({
                data: books,
                pagination: {
                    currentPage: page,
                    pageSize: size,
                    totalItems: count,
                    totalPages: Math.ceil(count / size),
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
                where: { id, deleted_at: null }
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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


}

export default new BooksController();