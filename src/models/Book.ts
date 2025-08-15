import { Model, DataTypes, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';
import People from './People';
import BookTag from './BookTag';
import Tag from './Tag';
import Review from './Review';

interface BookAttributes {
    id: string;
    title: string;
    author: string;
    synopsis: string | null;
    cover_url: string | null;
    publication_year: number | null;
    created_by_id: string | null;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;

}

interface BookCreationAttributes extends Optional<BookAttributes, 'id' | 'synopsis' | 'cover_url' | 'publication_year' | 'created_by_id' | 'updated_at' | 'created_at'> { }

class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
    public id!: string;
    public title!: string;
    public author!: string;
    public synopsis!: string | null;
    public cover_url!: string | null;
    public publication_year!: number | null;
    public created_by_id!: string | null;
    public created_at!: Date;
    public updated_at!: Date | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public deleted_at!: Date | null;


    public readonly createdBy?: People;
}

Book.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        author: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        synopsis: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        cover_url: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                isUrl: true,
            },
        },
        publication_year: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isValidYear(value: number | null) {
                    if (value && (value <= 0 || value > new Date().getFullYear() + 5)) {
                        throw new Error('O ano de publicação deve ser válido e não pode ser mais de 5 anos no futuro');
                    }
                },
            },
        },
        created_by_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'people',
                key: 'id',
            },
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'books',
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        hooks: {
            beforeValidate: (book) => {
                if (!book.id) {
                    book.id = uuidv4();
                }
            },
        },
        indexes: [
            {
                fields: ['title'],
                name: 'idx_books_title',
            },
            {
                fields: ['author'],
                name: 'idx_books_author',
            },
            {
                fields: ['created_by_id'],
                name: 'idx_books_created_by',
            },
            {
                fields: ['deleted_at'],
                where: {
                    deleted_at: null,
                },
            },
        ],
    }
);

Book.belongsTo(People, {
    foreignKey: 'created_by_id',
    as: 'createdBy',
});

Book.belongsToMany(Tag, {
    through: BookTag,
    foreignKey: 'book_id',
    otherKey: 'tag_id',
    as: 'tags',
});

Book.hasMany(Review, {
    foreignKey: 'book_id',
    as: 'reviews'
});

export default Book;