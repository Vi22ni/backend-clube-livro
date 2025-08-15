import { Model, DataTypes, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';
import Book from './Book';
import People from './People';

interface ReviewAttributes {
    id: string;
    book_id: string;
    person_id: string;
    rating: number;
    comment: string | null;
    created_at: Date;
    updated_at: Date | null;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id' | 'comment' | 'updated_at' | 'created_at'> { }

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
    public id!: string;
    public book_id!: string;
    public person_id!: string;
    public rating!: number;
    public comment!: string | null;
    public created_at!: Date;
    public updated_at!: Date | null;

    public readonly book?: Book;
    public readonly person?: People;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Review.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        book_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'books',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        person_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'people',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        rating: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
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
    },
    {
        sequelize,
        tableName: 'reviews',
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        hooks: {
            beforeValidate: (review) => {
                if (!review.id) {
                    review.id = uuidv4();
                }
            },
        },
        indexes: [
            {
                fields: ['book_id'],
                name: 'idx_reviews_book',
            },
            {
                fields: ['person_id'],
                name: 'idx_reviews_person',
            },
            {
                fields: ['rating'],
                name: 'idx_reviews_rating',
            },
            {
                fields: ['book_id', 'person_id'],
                unique: true,
                name: 'idx_reviews_book_person',
            },
        ],
    }
);

Review.belongsTo(Book, {
    foreignKey: 'book_id',
    as: 'book'
});

Review.belongsTo(People, {
    foreignKey: 'person_id',
    as: 'person'
});


export default Review;