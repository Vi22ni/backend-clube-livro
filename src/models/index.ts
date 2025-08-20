import sequelize from '../config/database';

import './People';
import './Book';
import './Tag';
import './BookTag';
import './Club';
import './ClubMember';
import './ClubBookHistory';
import './Chat';
import './Message';
import './Review';

import { setupAssociations } from './associations';

setupAssociations();

// const testConnection = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('✅ Conexão com o banco estabelecida com sucesso.');
    
//     // Sincroniza os modelos com o banco (cuidado em produção!)
//     if (process.env.NODE_ENV !== 'production') {
//       await sequelize.sync({ alter: true });
//       console.log('✅ Modelos sincronizados com o banco.');
//     }
//   } catch (error) {
//     console.error('❌ Erro ao conectar com o banco:', error);
//   }
// };

// testConnection();

export { sequelize };
export { default as People } from './People';
export { default as Book } from './Book';
export { default as Tag } from './Tag';
export { default as BookTag } from './BookTag';
export { default as Club } from './Club';
export { default as ClubMember } from './ClubMember';
export { default as ClubBookHistory } from './ClubBookHistory';
export { default as Chat } from './Chat';
export { default as Message } from './Message';
export { default as Review } from './Review';