import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/User';
import UserInterface from './models/User';
import { jwtSecretKey } from './config';

interface LoginData {
    email: string;
    password: string;
}

const SECRET_KEY = jwtSecretKey;
const EXPIRATION_TIME = 24 * 60 * 60; // 1 день

const generateToken = (userId: number): string => {
    const token = jwt.sign({ userId }, SECRET_KEY, {
        expiresIn: EXPIRATION_TIME,
    });
    return token;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { email, password } = req.body as LoginData;

    try {
        // Ищем пользователя в базе данных по его email
        const user: UserInterface | null = await User.findOne({ where: { email } });

        // Если пользователя нет, отправляем ответ с ошибкой
        if (!user) {
            return res.status(400).json({ message: 'Неправильный адрес электронной почты' });
        }

        // Если пароль не соответствует, отправляем ответ с ошибкой
        if (password != user.password) {
            console.log(`User with email ${email} tried to log in with incorrect password: ${password}`);
            return res.status(400).json({ message: 'Неправильный пароль' });
        }

        // Получаем id пользователя из базы данных
        const userId: number = user.id ? user.id : 0;

        // Пароль и данные пользователя верны,
        // генерируем JWT-токен
        const token: string = generateToken(userId);

        // Отправляем токен в HttpOnly cookie
        const cookieOptions = {
            httpOnly: true, // Запрещаем доступ к кукам из JS
            maxAge: EXPIRATION_TIME * 1000, // Устанавливаем время жизни в миллисекундах
            sameSite: 'strict', // Запрещаем куки отправлять на сторонние сайты
            secure: process.env.NODE_ENV === 'production', // Запрещаем отправку кук через незащищенное соединение (только для продакшна)
            path: "/", // Это свойство по умолчанию
        };

        res.setHeader(
            'Set-Cookie',
            `token=${token}; ${Object.entries(cookieOptions)
                .map(([key, value]) => `${key}=${value};`)
                .join('')}`
        );

        // Отправляем успешный ответ
        res.status(200).json({ message: 'Авторизация выполнена успешно' });
    } catch (error) {
        console.error('Произошла ошибка при авторизации:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
}
