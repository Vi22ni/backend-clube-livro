import { Model, DataTypes, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database'; 

interface PeopleAttributes {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    photo_url: string | null;
    bio: string | null;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
}

interface PeopleCreationAttributes extends Optional<PeopleAttributes, 'id' | 'photo_url' | 'bio' | 'updated_at' | 'deleted_at' | 'created_at'> { }

class People extends Model<PeopleAttributes, PeopleCreationAttributes> implements PeopleAttributes {
    public id!: string;
    public name!: string;
    public email!: string;
    public password_hash!: string;
    public photo_url!: string | null;
    public bio!: string | null;
    public created_at!: Date;
    public updated_at!: Date | null;
    public deleted_at!: Date | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

People.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        photo_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        bio: {
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
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'people',
        timestamps: true,
        paranoid: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        hooks: {
            beforeValidate: (people) => {
                if (!people.id) {
                    people.id = uuidv4();
                }
            },
        },
        indexes: [
            {
                unique: true,
                fields: ['email'],
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

export default People;