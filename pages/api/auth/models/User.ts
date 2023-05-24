import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../lib/database';

interface UserAttributes {
    id?: number;
    name: string;
    email: string;
    password: string;
    paymentOrderId?: string;
    paymentStatus?: string;
    paymentDate?: Date; // добавляем новое свойство paymentDate
    createdAt?: Date;
    updatedAt?: Date;
}

export class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public paymentOrderId!: string;
    public paymentStatus!: string;
    public paymentDate!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
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
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        paymentOrderId: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        paymentStatus: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        paymentDate: { // добавляем новое свойство paymentDate
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: 'users',
        sequelize,
    }
);

export default User;
