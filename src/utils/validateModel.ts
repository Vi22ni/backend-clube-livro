import { Request, Response, NextFunction } from 'express';
import { ModelStatic } from 'sequelize';

export async function validateModel(
    Model: ModelStatic<any>,
    data: Record<string, any>,
    options: { exclude?: string[] } = {}
) {
    const instance = Model.build(data);

    try {
        await instance.validate({ skip: options.exclude });
        return { isValid: true, errors: null };
    } catch (error: any) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map((err: any) => ({
                field: err.path,
                message: err.message,
            }));
            return { isValid: false, errors };
        }
        throw error;
    }
}

export const validateRequest = (Model: ModelStatic<any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const { isValid, errors } = await validateModel(Model, req.body);

        if (!isValid) {
            return res.status(400).json({ errors });
        }

        next();
    };