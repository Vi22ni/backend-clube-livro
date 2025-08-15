import { Model, DataTypes, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';
import Club from './Club';
import Message from './Message';

interface ChatAttributes {
    id: string;
    club_id: string;
    created_at: Date;
}

interface ChatCreationAttributes extends Optional<ChatAttributes, 'id' | 'created_at'> { }

class Chat extends Model<ChatAttributes, ChatCreationAttributes> implements ChatAttributes {
    public id!: string;
    public club_id!: string;
    public created_at!: Date;

    public readonly club?: Club;
}

Chat.init(
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
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'chats',
        timestamps: false,
        hooks: {
            beforeValidate: (chat) => {
                if (!chat.id) {
                    chat.id = uuidv4();
                }
            },
        },
        indexes: [
            {
                fields: ['club_id'],
                name: 'idx_chats_club',
            },
        ]
    }
);

Chat.belongsTo(Club, {
    foreignKey: 'club_id',
    as: 'club'
});

Chat.hasMany(Message, {
    foreignKey: 'chat_id',
    as: 'messages'
});


export default Chat;