import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Login as LoginComponent } from '../components/Login';

interface LoginPageProps {
    onLogin: (email: string, password: string) => Promise<void>;
    isAuthenticated: boolean;
}

export const Login: React.FC<LoginPageProps> = ({ onLogin, isAuthenticated }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLoginSubmit = async (email: string, password: string) => {
        setLoading(true);
        setError('');

        try {
            await onLogin(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-nexus-obsidian flex items-center justify-center">
            <LoginComponent
                onLogin={handleLoginSubmit}
                loading={loading}
                error={error}
            />
        </div>
    );
};
