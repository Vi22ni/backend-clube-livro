import { Request, Response } from 'express';
import People from '../models/People';
import { hashPassword } from '../utils/password';

interface PaginationQuery {
    page?: string;
    size?: string;
}


class PeopleController {
    async create(req: Request, res: Response) {

        try {
            const { name, email, password, bio } = req.body;

            const existingPerson = await People.findOne({ where: { email } });
            if (existingPerson) {
                return res.status(400).json({ error: 'Email já está em uso' });
            }

            const hashedPassword = await hashPassword(password);
            const newPerson = await People.create({
                name,
                email,
                password_hash: hashedPassword,
                bio: bio || null,
            });

            const { password_hash: _, ...personData } = newPerson.toJSON();

            return res.status(201).json(personData);
        } catch (error) {
            console.error('Erro ao criar pessoa:', error);
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

            const { count, rows: people } = await People.findAndCountAll({
                where: { deleted_at: null },
                attributes: { exclude: ['password_hash'] },
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['created_at', 'DESC']]
            });

            return res.status(200).json({
                data: people,
                pagination: {
                    currentPage: page,
                    pageSize: size,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao listar pessoas:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const person = await People.findOne({
                where: { id, deleted_at: null },
                attributes: { exclude: ['password_hash'] },
            });

            if (!person) {
                return res.status(404).json({ error: 'Pessoa não encontrada' });
            }

            return res.json(person);
        } catch (error) {
            console.error('Erro ao buscar pessoa:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async update(req: Request, res: Response) {

        try {
            const { id } = req.params;
            const { name, email, bio } = req.body;

            const person = await People.findOne({ where: { id, deleted_at: null } });
            if (!person) {
                return res.status(404).json({ error: 'Pessoa não encontrada' });
            }

            if (email && email !== person.email) {
                const emailExists = await People.findOne({ where: { email } });
                if (emailExists) {
                    return res.status(400).json({ error: 'Email já está em uso' });
                }
            }

            await person.update({
                name: name || person.name,
                email: email || person.email,
                bio: bio !== undefined ? bio : person.bio,
            });

            const { password_hash: _, ...updatedPerson } = person.toJSON();

            return res.json(updatedPerson);
        } catch (error) {
            console.error('Erro ao atualizar pessoa:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const person = await People.findOne({ where: { id, deleted_at: null } });
            if (!person) {
                return res.status(404).json({ error: 'Pessoa não encontrada' });
            }

            await person.destroy();

            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar pessoa:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }


}

export default new PeopleController();