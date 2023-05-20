import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { User } from './models/User';
import { sequelize } from './lib/database';
import { jwtSecretKey } from './config';
import {random} from "nanoid";
import {generateRandomString} from "@/utils/app/codeblock";

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export default async function registerHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Метод ${req.method} не поддерживается`);
    }

    const { name, email, password } = req.body as RegisterData;

    // Проверяем, что все поля заполнены
    if (!name || !email || !password) {
        return res.status(422).json({ message: 'Заполните все поля' });
    }

    try {
        await sequelize.authenticate();
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(422).json({ message: 'Этот email уже используется' });
        }

        // Создаем нового пользователя
        const newUser: User = await User.create({
            name,
            email,
            password,
            paymentOrderId: generateRandomString(16), // Задаем значение paymentOrderId
        });
        // Создаем и отправляем JWT в качестве HttpOnly cookie на стороне клиента
        const token = jwt.sign({ userId: newUser }, jwtSecretKey, { expiresIn: '1d' });

        const cookieOptions = {
            httpOnly: true, // Запрещаем доступ к кукам из JS
            maxAge: 24 * 60 * 60, // Устанавливаем время жизни в секундах (1 day)
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

        res.status(201).json({ message: 'Регистрация прошла успешно' });

    } catch (error) {
        console.error('Не удалось подключиться к базе данных:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
}
