import { Sequelize } from 'sequelize';


export const sequelize = new Sequelize(
    'hanska5n_gpt', // здесь имя вашей базы данных WordPress
    'hanska5n_gpt', // здесь имя пользователя для подключения к вашей базе данных WordPress
    'Yonsei3930204', // здесь пароль пользователя для подключения к вашей базе данных WordPress
    {
        host: 'localhost', // хост для подключения к БД
        dialect: 'mysql', // задаем используемую базу данных - MySQL
        dialectOptions: {
            ssl: false,
        }
    }
);

// Создание и синхронизация таблиц в базе данных
sequelize.sync()
    .then(() => {
        console.log('All models were synchronized successfully.');
    })
    .catch((error) => {
        console.error(`An error occurred while synchronizing the models: ${error.message}`);
    });
