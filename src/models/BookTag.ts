import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Book from './Book';
import Tag from './Tag';

interface BookTagAttributes {
    book_id: string;
    tag_id: string;
}

class BookTag extends Model<BookTagAttributes> implements BookTagAttributes {
    public book_id!: string;
    public tag_id!: string;

    public readonly Book?: Book;
    public readonly Tags?: Tag;
}

BookTag.init(
    {
        book_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: 'books',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        tag_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: 'tags',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        tableName: 'book_tags',
        timestamps: false,
    }
);

export default BookTag;