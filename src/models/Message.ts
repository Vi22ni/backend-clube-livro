import { Model, DataTypes, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';
import Chat from './Chat';
import People from './People';

interface MessageAttributes {
    id: string;
    chat_id: string;
    person_id: string;
    content: string;
    created_at: Date;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'created_at'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
    public id!: string;
    public chat_id!: string;
    public person_id!: string;
    public content!: string;
    public created_at!: Date;

    public readonly chat?: Chat;
    public readonly person?: People;
}

Message.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        chat_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'chats',
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
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
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
        tableName: 'messages',
        timestamps: false,
        hooks: {
            beforeValidate: (message) => {
                if (!message.id) {
                    message.id = uuidv4();
                }
            },
        },
        indexes: [
            {
                fields: ['chat_id'],
                name: 'idx_messages_chat',
            },
            {
                fields: ['person_id'],
                name: 'idx_messages_person',
            },
            {
                fields: ['created_at'],
                name: 'idx_messages_created_at',
            },
        ],
    }
);

Message.belongsTo(Chat, {
    foreignKey: 'chat_id',
    as: 'chat'
});

Message.belongsTo(People, {
    foreignKey: 'person_id',
    as: 'person'
});

export default Message;