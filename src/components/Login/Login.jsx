import React, {useState} from 'react';
import styles from './Login.module.css';
import {login} from '../../services/authService.js'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('All fields are required!');
            return;
        }
        setError('');
        try {
            const data = await login(username, password);
            if (data.token) {
                window.location.href = '/dashboard';
            }
        } catch (err) {
            setError('Invalid username or password!');
        }
    };


    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginForm}>
            {error && (
                <div className={styles.errorBox}>
                    <p>{error}</p>
                </div>
            )}
                <h1 className={styles.loginLogo}>B&B System</h1>
                <form onSubmit={handleLogin}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className={styles.loginButton}>
                        Login
                    </button>
                </form>

                <a href="#" className={styles.forgotPassword}>
                    Forgot Password?
                </a>
            </div>
        </div>
    );
};


export default Login;