import React, { useState } from 'react';
import { inspect } from 'util';

interface PaymentFormProps {
    show: boolean;
    setShow: (show: boolean) => void; // Функция, которая изменяет состояние show
}

const PaymentForm: React.FC<PaymentFormProps> = ({ show, setShow }) => {
    const [amount, setAmount] = useState<number>(1000); // Используем состояние для хранения суммы оплаты
    const [paymentStatus, setPaymentStatus] = useState<string>('PENDING'); // Состояние для хранения статуса платежа

    const handlePayment = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Остановить стандартное поведение кнопки

        try {
            const paymentData = {
                amount,
                description: 'Оплата подписки на сайте', // Описание платежа
            };

            const response = await fetch('/api/pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData),
            });

            const result = await response.json();
            setPaymentStatus('REDIRECTED');

            window.location.href = result.paymentUrl; // Перенаправляем пользователя на страницу оплаты
        } catch (error) {
            console.error(error);
            setPaymentStatus('FAILED');
        }
    };

    const handlePaymentReceived = async () => {
        try {
            const response = await fetch('/api/onPaymentReceived'); // Отправляем запрос на сервер для обновления статуса платежа
            const result = await response.json();
            setPaymentStatus('COMPLETED');
        } catch (error) {
            console.error(error);
            setPaymentStatus('FAILED');
        }
    };

    const handleLogout = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Остановить стандартное поведение кнопки
        setShow(false); // Устанавливаем состояние show в false, чтобы скрыть PaymentForm
    };

    return (
        <div className={'overlay'} style={{ display: show ? 'block' : 'none' }}>
            <div className={'form'}>
                <div className="menu-container">
                    <div className="menu-panel">
                        <iframe
                            src="https://widgets.freekassa.ru?type=payment-window&lang=ru&theme=dark&default_amount=999&api_key=c2f3b4a9a2ce28058ab6e2602704b3c0&shopID=34376"
                            width="300" height="400" frameBorder="0">
                        </iframe>
                        <button className='button' onClick={handleLogout}>Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;
