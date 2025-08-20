import { Request, Response } from 'express';
import Review from '../models/Review';
import Book from '../models/Book';
import People from '../models/People';

interface PaginationQuery {
    page?: string;
    size?: string;
}

class ReviewsController {
    async create(req: Request, res: Response) {
        try {
            const { book_id, rating, comment } = req.body;
            const person_id = req.params.id;

            const book = await Book.findOne({ where: { id: book_id, deleted_at: null } });
            if (!book) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }
            const existingReview = await Review.findOne({
                where: { book_id, person_id }
            });

            if (existingReview) {
                return res.status(400).json({ error: 'Você já avaliou este livro' });
            }

            const review = await Review.create({
                book_id,
                person_id,
                rating,
                comment
            });

            const newReview = await Review.findByPk(review.id, {
                include: [
                    {
                        model: Book,
                        as: 'book',
                        attributes: ['id', 'title', 'author']
                    }
                ]
            });

            return res.status(201).json(newReview);
        } catch (error) {
            console.error('Erro ao criar avaliação:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { rating, comment } = req.body;
            const person_id = req.params.id;

            const review = await Review.findOne({
                where: { id, person_id },
                include: [
                    {
                        model: Book,
                        as: 'book',
                        attributes: ['id', 'title', 'author']
                    }
                ]
            });

            if (!review) {
                return res.status(404).json({ error: 'Avaliação não encontrada' });
            }

            await review.update({
                rating: rating || review.rating,
                comment: comment !== undefined ? comment : review.comment
            });

            return res.json(review);
        } catch (error) {
            console.error('Erro ao atualizar avaliação:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async listAll(req: Request<{}, {}, {}, PaginationQuery & { book_id?: string }>, res: Response) {
        try {
            const { page = '1', size = '10', book_id } = req.query;
            const pageNum = parseInt(page);
            const sizeNum = parseInt(size);

            if (isNaN(pageNum) || isNaN(sizeNum) || pageNum < 1 || sizeNum < 1) {
                return res.status(400).json({ error: 'Parâmetros de paginação inválidos' });
            }

            const whereClause: any = {};
            if (book_id) {
                whereClause.book_id = book_id;
            }

            const { count, rows: reviews } = await Review.findAndCountAll({
                where: whereClause,
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['created_at', 'DESC']],
                include: [
                    {
                        model: Book,
                        as: 'book',
                        attributes: ['id', 'title', 'author']
                    },
                    {
                        model: People,
                        as: 'person',
                        attributes: ['id', 'name']
                    }
                ]
            });

            return res.status(200).json({
                data: reviews,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao listar avaliações:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const review = await Review.findByPk(id, {
                include: [
                    {
                        model: Book,
                        as: 'book',
                        attributes: ['id', 'title', 'author', 'cover_url']
                    },
                    {
                        model: People,
                        as: 'person',
                        attributes: ['id', 'name', 'photo_url']
                    }
                ]
            });

            if (!review) {
                return res.status(404).json({ error: 'Avaliação não encontrada' });
            }

            return res.json(review);
        } catch (error) {
            console.error('Erro ao buscar avaliação:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getByBook(req: Request<{ id: string }, {}, {}, PaginationQuery>, res: Response) {
        try {
            const { id: book_id } = req.params;
            const { page = '1', size = '10' } = req.query;
            const pageNum = parseInt(page);
            const sizeNum = parseInt(size);

            if (isNaN(pageNum) || isNaN(sizeNum) || pageNum < 1 || sizeNum < 1) {
                return res.status(400).json({ error: 'Parâmetros de paginação inválidos' });
            }

            const book = await Book.findOne({ where: { id: book_id, deleted_at: null } });
            if (!book) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }

            const { count, rows: reviews } = await Review.findAndCountAll({
                where: { book_id },
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['created_at', 'DESC']],
                include: [
                    {
                        model: People,
                        as: 'person',
                        attributes: ['id', 'name', 'photo_url']
                    }
                ]
            });

            return res.status(200).json({
                data: reviews,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao buscar avaliações do livro:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default new ReviewsController();