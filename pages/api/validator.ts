import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import {jwtSecretKey} from "@/pages/api/auth/config";

const SECRET_KEY = jwtSecretKey;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const token = req.cookies.token; // Получаем токен из HttpOnly cookie

    if (!token) {
        // Если токен отсутствует в куках, отправляем ответ с HTTP-кодом 401
        return res.status(401).json({ message: 'Необходимо авторизоваться для доступа к этому ресурсу' });
    }

    try {
        // Расшифровываем токен и получаем идентификатор пользователя
        const { userId } = jwt.verify(token, SECRET_KEY) as { userId: number };
        if (!userId) {
            // Если идентификатор пользователя не найден, отправляем ответ с HTTP-кодом 401
            return res.status(401).json({ message: 'Необходимо авторизоваться для доступа к этому ресурсу' });
        }

        // Идентификатор пользователя найден, отправляем HTTP-код 200
        return  res.status(200).send('ok');

    } catch (error) {
        // Обрабатываем ошибку при расшифровке токена
        console.error('Произошла ошибка при проверке валидности токена:', error);
        res.status(500).json({ message: 'Произошла ошибка, попробуйте позже' });
    }
}
