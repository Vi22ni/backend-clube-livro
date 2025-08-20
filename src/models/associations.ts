import { Sequelize } from 'sequelize';
import sequelize from '../config/database';

import Book from './Book';
import Tag from './Tag';
import BookTag from './BookTag';
import People from './People';
import Club from './Club';
import ClubMember from './ClubMember';
import ClubBookHistory from './ClubBookHistory';
import Chat from './Chat';
import Message from './Message';
import Review from './Review';

export const setupAssociations = () => {
    Book.belongsToMany(Tag, {
        through: BookTag,
        foreignKey: 'book_id',
        otherKey: 'tag_id',
        as: 'tags',
    });

    Tag.belongsToMany(Book, {
        through: BookTag,
        foreignKey: 'tag_id',
        otherKey: 'book_id',
        as: 'books',
    });

    Book.belongsTo(People, {
        foreignKey: 'created_by_id',
        as: 'createdBy',
    });

    Book.hasMany(Review, {
        foreignKey: 'book_id',
        as: 'reviews',
    });

    Review.belongsTo(Book, {
        foreignKey: 'book_id',
        as: 'book',
    });

    Review.belongsTo(People, {
        foreignKey: 'person_id',
        as: 'person',
    });

    People.hasMany(Review, {
        foreignKey: 'person_id',
        as: 'reviews',
    });

    Club.belongsTo(People, {
        foreignKey: 'creator_id',
        as: 'creator',
    });

    Club.belongsTo(Book, {
        foreignKey: 'current_book_id',
        as: 'currentBook',
    });

    Club.belongsToMany(People, {
        through: ClubMember,
        foreignKey: 'club_id',
        otherKey: 'person_id',
        as: 'members',
    });

    People.belongsToMany(Club, {
        through: ClubMember,
        foreignKey: 'person_id',
        otherKey: 'club_id',
        as: 'clubs',
    });

    Club.hasMany(ClubBookHistory, {
        foreignKey: 'club_id',
        as: 'history',
    });

    ClubBookHistory.belongsTo(Club, {
        foreignKey: 'club_id',
        as: 'club',
    });

    ClubBookHistory.belongsTo(Book, {
        foreignKey: 'book_id',
        as: 'book',
    });

    Chat.belongsTo(Club, {
        foreignKey: 'club_id',
        as: 'club',
    });

    Club.hasMany(Chat, {
        foreignKey: 'club_id',
        as: 'chats',
    });

    Message.belongsTo(Chat, {
        foreignKey: 'chat_id',
        as: 'chat',
    });

    Message.belongsTo(People, {
        foreignKey: 'person_id',
        as: 'person',
    });

    Chat.hasMany(Message, {
        foreignKey: 'chat_id',
        as: 'messages',
    });

    console.log('Todas as associações foram configuradas com sucesso!');
};

export default setupAssociations;