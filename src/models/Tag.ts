import { Model, DataTypes, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';
import Book from './Book';
import BookTag from './BookTag';

interface TagAttributes {
    id: string;
    name: string;
    created_at: Date;
}

interface TagCreationAttributes extends Optional<TagAttributes, 'id' | 'created_at'> { }

class Tag extends Model<TagAttributes, TagCreationAttributes> implements TagAttributes {
    public id!: string;
    public name!: string;
    public created_at!: Date;

    public readonly createdAt!: Date;

    public readonly Books?: Book[];
}

Tag.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [1, 50],
            },
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'tags',
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: false,
        hooks: {
            beforeValidate: (tag) => {
                if (!tag.id) {
                    tag.id = uuidv4();
                }
            },
        },
        indexes: [
            {
                name: 'idx_tag_name_search',
                fields: ['name'],
                using: 'BTREE'
            }
        ]
    }
);

Tag.belongsToMany(Book, {
    through: BookTag,
    foreignKey: 'tag_id',
    otherKey: 'book_id',
    as: 'books',
});

export default Tag;