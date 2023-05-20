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
                <h2>Оплата</h2>
                <div className="menu-container">
                    <div className="menu-panel">
                        <div className="form-group">
                            <label htmlFor="amount">Сумма оплаты (руб.)</label>
                            <input type="text" id="amount" name="amount" value={amount} disabled />
                        </div>
                        {paymentStatus === 'PENDING' && (
                            <button className='button' onClick={handlePayment}>Оплатить</button>

                        )}
                        {paymentStatus === 'REDIRECTED' && (
                            <div>Вы будете перенаправлены на страницу оплаты...</div>
                        )}
                        {paymentStatus === 'COMPLETED' && (
                            <div>Платеж успешно завершен</div>
                        )}
                        {paymentStatus === 'FAILED' && (
                            <div>Произошла ошибка при оплате</div>
                        )}
                        <button className='button' onClick={handleLogout}>Выход</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;
