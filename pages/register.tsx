import React from 'react';

import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';

import styles from '../styles/Register.module.css';

type FormData = {
    name: string;
    email: string;
    password: string;
};

type FormError = {
    name?: string;
    email?: string;
    password?: string;
    general?: string;
};

export default function Register() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = React.useState<FormData>({
        name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = React.useState<FormError>({});

    const validateForm = () => {
        const newErrors: FormError = {};
        let isValid = true;

        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Registration successful, redirect to login
            router.push('/api/auth/signin');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setErrors({
                general: error.message || 'An error occurred during registration',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <React.Fragment>
            <Head>
                <title>Register | Reels Creator</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.formContainer}>
                    <div>
                        <h2 className={styles.header}>Create your account</h2>
                        <p className={styles.subHeader}>
                            Or{' '}
                            <Link href="/api/auth/signin" className={styles.link}>
                                sign in to your account
                            </Link>
                        </p>
                    </div>

                    {errors.general && (
                        <div className={styles.errorContainer}>{errors.general}</div>
                    )}

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.fieldsContainer}>
                            <div className={styles.field}>
                                <label htmlFor="name" className={styles.label}>
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Your name (optional)"
                                />
                                {errors.name && <p className={styles.errorText}>{errors.name}</p>}
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="email" className={styles.label}>
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="you@example.com"
                                />
                                {errors.email && <p className={styles.errorText}>{errors.email}</p>}
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="password" className={styles.label}>
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Minimum 6 characters"
                                />
                                {errors.password && (
                                    <p className={styles.errorText}>{errors.password}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button type="submit" disabled={isLoading} className={styles.button}>
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
}
