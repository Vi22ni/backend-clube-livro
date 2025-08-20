import e, { Request, Response } from 'express';
import ClubMember from '../models/ClubMember';
import Club from '../models/Club';
import People from '../models/People';

interface PaginationQuery {
    page?: string;
    size?: string;
}

class ClubMemberController {
    async create(req: Request, res: Response) {
        try {
            const { club_id, person_id, joined_at, left_at } = req.body;

            const newMember = await ClubMember.create({
                club_id,
                person_id,
                joined_at,
                left_at
            });

            return res.status(201).json(newMember);
        } catch (error) {
            console.error('Erro ao adicionar membro:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async update(req: Request<{ club_id: string; person_id: string }>, res: Response) {
        try {
            const { club_id, person_id } = req.params;
            const { joined_at, left_at } = req.body;

            const member = await ClubMember.findOne({ where: { club_id, person_id } });
            if (!member) {
                return res.status(404).json({ error: 'membro não encontrado' });
            }

            const updatedMember = await member.update({
                joined_at: joined_at !== undefined ? joined_at : member.joined_at,
                left_at: left_at !== undefined ? left_at : member.left_at
            });

            return res.json(updatedMember.toJSON());
        } catch (error) {
            console.error('Erro ao atualizar membro:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async delete(req: Request<{ club_id: string; person_id: string }>, res: Response) {
        try {
            const { club_id, person_id } = req.params;

            const member = await ClubMember.findOne({ where: { club_id, person_id } });
            if (!member) {
                return res.status(404).json({ error: 'membro não encontrado' });
            }

            await member.destroy();

            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao remover membro:', error);
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

            const { count, rows: members } = await ClubMember.findAndCountAll({
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['joined_at', 'DESC']],
                include: [
                    { model: Club, as: 'club', attributes: ['id', 'name'] },
                    { model: People, as: 'person', attributes: ['id', 'name'] }
                ]
            });

            return res.status(200).json({
                data: members,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao listar membros:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getById(req: Request<{ club_id: string; person_id: string }>, res: Response) {
        try {
            const { club_id, person_id } = req.params;
            const member = await ClubMember.findOne({
                where: { club_id, person_id },
                include: [
                    { model: Club, as: 'club', attributes: ['id', 'name'] },
                    { model: People, as: 'person', attributes: ['id', 'name'] }
                ]
            });

            if (!member) {
                return res.status(404).json({ error: 'membro não encontrado' });
            }

            return res.json(member);
        } catch (error) {
            console.error('Erro ao buscar membro:', error);
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

            const { count, rows: members } = await ClubMember.findAndCountAll({
                where: { club_id },
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['joined_at', 'DESC']],
                include: [
                    { model: Club, as: 'club', attributes: ['id', 'name'] },
                    { model: People, as: 'person', attributes: ['id', 'name'] }
                ]
            });

            return res.status(200).json({
                data: members,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao buscar membros por club_id:', error);
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

            const { count, rows: members } = await ClubMember.findAndCountAll({
                where: { person_id },
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum,
                order: [['joined_at', 'DESC']],
                include: [
                    { model: Club, as: 'club', attributes: ['id', 'name'] },
                    { model: People, as: 'person', attributes: ['id', 'name'] }
                ]
            });

            return res.status(200).json({
                data: members,
                pagination: {
                    currentPage: pageNum,
                    pageSize: sizeNum,
                    totalItems: count,
                    totalPages: Math.ceil(count / sizeNum),
                },
            });
        } catch (error) {
            console.error('Erro ao buscar membros por person_id:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default new ClubMemberController();