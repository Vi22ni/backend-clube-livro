import { Model, DataTypes, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';
import Club from './Club';
import Book from './Book';

interface ClubBookHistoryAttributes {
    id: string;
    club_id: string;
    book_id: string;
    started_at: Date;
    finished_at: Date | null;
    notes: string | null;
}

interface ClubBookHistoryCreationAttributes extends Optional<ClubBookHistoryAttributes, 'id' | 'finished_at' | 'notes' | 'started_at'> { }

class ClubBookHistory extends Model<ClubBookHistoryAttributes, ClubBookHistoryCreationAttributes> implements ClubBookHistoryAttributes {
    public id!: string;
    public club_id!: string;
    public book_id!: string;
    public started_at!: Date;
    public finished_at!: Date | null;
    public notes!: string | null;

    public readonly club?: Club;
    public readonly book?: Book;
}

ClubBookHistory.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        club_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'clubs',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        book_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'books',
                key: 'id',
            },
        },
        started_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        finished_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'club_book_history',
        timestamps: false,
        hooks: {
            beforeValidate: (history) => {
                if (!history.id) {
                    history.id = uuidv4();
                }
            },
        },
        indexes: [
            {
                fields: ['club_id'],
                name: 'idx_club_book_history_club',
            },
            {
                fields: ['book_id'],
                name: 'idx_club_book_history_book',
            },
        ],
    }
);

ClubBookHistory.belongsTo(Club, {
    foreignKey: 'club_id',
    as: 'club'
});

ClubBookHistory.belongsTo(Book, {
    foreignKey: 'book_id',
    as: 'book'
});

export default ClubBookHistory;