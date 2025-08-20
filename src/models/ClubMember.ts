import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Club from './Club';
import People from './People';

interface ClubMemberAttributes {
    club_id: string;
    person_id: string;
    joined_at: Date;
    left_at: Date | null;
}

class ClubMember extends Model<ClubMemberAttributes> implements ClubMemberAttributes {
    public club_id!: string;
    public person_id!: string;
    public joined_at!: Date;
    public left_at!: Date | null;

    public readonly club?: Club;
    public readonly person?: People;
}

ClubMember.init(
    {
        club_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: 'clubs',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        person_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: 'people',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        joined_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        left_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'club_members',
        timestamps: false,
        indexes: [
            {
                fields: ['person_id'],
                name: 'idx_club_members_person',
            },
        ],
    }
);

export default ClubMember;