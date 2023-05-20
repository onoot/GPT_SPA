import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
    process.env.DB_NAME || 'root',
    process.env.DB_USERNAME || 'postgres',
    process.env.DB_PASSWORD || 'root',
    {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        dialect: 'postgres',
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production',
        },
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
