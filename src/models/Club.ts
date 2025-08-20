import { Model, DataTypes, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';
import People from './People';
import Book from './Book';
import ClubBookHistory from './ClubBookHistory';
import ClubMember from './ClubMember';
import Chat from './Chat';

interface ClubAttributes {
    id: string;
    name: string;
    description: string | null;
    current_book_id: string | null;
    creator_id: string;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
}

interface ClubCreationAttributes extends Optional<ClubAttributes, 'id' | 'description' | 'current_book_id' | 'updated_at' | 'deleted_at' | 'created_at'> { }

class Club extends Model<ClubAttributes, ClubCreationAttributes> implements ClubAttributes {
    public id!: string;
    public name!: string;
    public description!: string | null;
    public current_book_id!: string | null;
    public creator_id!: string;
    public created_at!: Date;
    public updated_at!: Date | null;
    public deleted_at!: Date | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly creator?: People;
    public readonly currentBook?: Book;
    public readonly members?: People[];
    public readonly history?: ClubBookHistory[];
}

Club.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        current_book_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'books',
                key: 'id',
            },
        },
        creator_id: {
            type: DataTypes.UUID,
            allowNull: false,
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
        tableName: 'clubs',
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        hooks: {
            beforeValidate: (club) => {
                if (!club.id) {
                    club.id = uuidv4();
                }
            },
        },
        indexes: [
            {
                fields: ['creator_id'],
                name: 'idx_clubs_creator',
            },
            {
                fields: ['current_book_id'],
                name: 'idx_clubs_current_book',
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

export default Club;