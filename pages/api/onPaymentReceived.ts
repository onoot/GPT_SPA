import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../pages/api/auth/models/User';
import freekassa from "freekassa-node";

const merchantId = 'Мостовик';
const secretKey = '9294a9109f962a618f6b68736f816461';
const currency = 'RUB';

// Создаем экземпляр FreeKassa с помощью ключа мерчанта и секретного ключа
const fk = new freekassa(merchantId, secretKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { amount, orderId, sign } = req.query;

    // Проверяем подпись
    if (!fk.checkSign(req.query, sign)) {
        return res.status(403).json({ message: 'Invalid signature' });
    }

    // Обновляем информацию о платеже в базе данных
    try {
        const user = await User.findOne({ where: { paymentOrderId: orderId } });
        if (user) {
            const date = new Date();
            date.setMonth(date.getMonth() + 1);

            await user.update({
                paymentStatus: 'COMPLETED',
                paymentDate: new Date(),
                paymentExpiresAt: new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000),
            });

            // Возвращаем успех в качестве ответа на запрос
            return res.status(200).json({ message: 'Payment updated' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
