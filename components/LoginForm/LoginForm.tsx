import { useState } from 'react';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';


interface LoginFormProps {
    onLogin: () => void;
}

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData extends LoginData {
    repeatPassword: string;
    name: string;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
    const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' });
    const [isLoginForm, setIsLoginForm] = useState(true); // состояние формы (вход/регистрация)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData((prevData) => ({
            ...prevData,
            [event.target.name]: event.target.value,
        }));
    };

    const { mutateAsync, isLoading } = useMutation(async () => {
        let endpoint = isLoginForm ? '/api/auth/login' : '/api/auth/register';
        let body = JSON.stringify(loginData);
        if (!isLoginForm) {
            // Проверяем, что оба поля пароля совпадают
            const registerData = loginData as RegisterData;
            if (registerData.password !== registerData.repeatPassword) {
                throw new Error('Password and repeat password do not match');
            }
            body = JSON.stringify({
                name: registerData.name,
                email: registerData.email,
                password: registerData.password,
            });
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await mutateAsync();
            toast.success('Login successful');
            onLogin(); // Вызов переданной в пропсах функции
        } catch (error) {
            toast.error('Ошибка: '+error);
        }
    };

    const handleSwitchForm = () => {
        setIsLoginForm((prevState) => !prevState); // переключение состояния формы
    };

    return (
        <div className="menu-container">
            {isLoginForm ? (
                <form onSubmit={handleSubmit}>
                    <div className="menu-panel">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleInputChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleInputChange}
                        />
                        <button type="submit">Login</button>
                    </div>
                    <p>
                        Нет аккаунта?{' '}
                        <button type="button" onClick={handleSwitchForm}>
                            Регистрация
                        </button>
                    </p>
                </form>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="menu-panel">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            onChange={handleInputChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleInputChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleInputChange}
                        />
                        <input
                            type="password"
                            name="repeatPassword"
                            placeholder="Repeat password"
                            onChange={handleInputChange}
                        />
                        <button type="submit">Register</button>
                    </div>
                    <p>
                        Уже есть аккаунт?{' '}
                        <button type="button" onClick={handleSwitchForm}>
                            Вход
                        </button>
                    </p>
                </form>
            )}
        </div>
    );
};

export default LoginForm;
