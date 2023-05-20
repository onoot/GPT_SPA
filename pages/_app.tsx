import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';

import '@/styles/globals.css';
import LoginForm from '../components/LoginForm/LoginForm';
import { toast } from 'react-hot-toast/headless';

const inter = Inter({ subsets: ['latin'] });

function App({ Component, pageProps }: AppProps<{}>) {
    const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
    const queryClient = new QueryClient();

    const handleTokenValidation = () => {
        // Здесь проверяем наличие JWT токена
        setIsTokenValid(true); // Устанавливаем флаг в true если токен есть
        // setIsTokenValid(false); // Устанавливаем флаг в false если токен отсутствует
    };

    useEffect(() => {
        async function checkTokenValidity() {
            try {
                const response = await fetch('/api/validator', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Включаем куки, содержащие токен
                });

                if (response.ok) {
                    // Токен валиден, устанавливаем флаг в true
                    setIsTokenValid(true);
                } else {
                    // Токен невалиден, устанавливаем флаг в false и выводим ошибку
                    setIsTokenValid(false);
                    const data = await response.json();
                    toast.error(data.message);
                }
            } catch (error) {
                console.error(error);
                toast.error(`Ошибка: ${error}`); // Обрабатываем ошибку в выводим сообщение
            }
        }

        checkTokenValidity();
    }, []);

    return (
        <div className={inter.className}>
            <Toaster />
            <QueryClientProvider client={queryClient}>
                {isTokenValid ? (
                    // Отображаем интерактивный контент и меню если токен валиден
                    <Component {...pageProps} />

                ) : (
                    // Отображаем форму авторизации и затемнение если токен отсутствует
                    <div className="menu-container">
                        <div className="menu-panel">
                            <LoginForm onLogin={handleTokenValidation} />
                        </div>
                    </div>
                )}
            </QueryClientProvider>
        </div>
    );
}

export default appWithTranslation(App);

