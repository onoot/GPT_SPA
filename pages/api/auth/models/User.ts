import { Sequelize, DataTypes, Model, EnumDataType } from 'sequelize';
import { sequelize } from '../lib/database';

export class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subscriptionRate: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        subscriptionExpiresAt: {
            type: DataTypes.DATE,
        },
        paymentMethod: {
            type: DataTypes.STRING,
            defaultValue: 'FreeKassa', // использовать FreeKassa по умолчанию
        },
        paymentAmount: {
            type: DataTypes.INTEGER,
        },
        paymentDate: {
            type: DataTypes.DATE,
        },
        paymentExpiresAt: {
            type: DataTypes.DATE,
        },
        paymentOrderId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        paymentStatus: {
            type: DataTypes.ENUM<'PENDING' | 'COMPLETED' | 'EXPIRED'>('PENDING', 'COMPLETED', 'EXPIRED'),
            defaultValue: 'PENDING',
        },
    },
    {
        sequelize,
        modelName: 'User',
    }
);
