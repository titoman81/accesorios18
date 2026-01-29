import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const Login: React.FC = () => {
    const [emailOrUser, setEmailOrUser] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('[Login] handleLogin triggered');
        setLoading(true);
        setError(null);

        let loginIdentifier = emailOrUser.trim();

        // Special case for fixed admin
        if (loginIdentifier.toLowerCase() === 'angelesrosales') {
            if (password === 'noviembre21') {
                loginIdentifier = 'angelesrosales@accesorios18.com';
            } else {
                setError('Contraseña de administrador incorrecta');
                setLoading(false);
                return;
            }
        }

        try {
            console.log('[Login] Attempting sign-in for:', loginIdentifier);
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@placeholder.com`,
                password: password,
            });

            if (signInError) throw signInError;

            console.log('[Login] Sign-in successful');
            alert('¡Acceso concedido! Redirigiendo...');
            navigate('/');
        } catch (err: any) {
            console.error('[Login] Error during sign-in:', err);
            const errMsg = err.message || 'Error desconocido al iniciar sesión';
            setError(errMsg);
            alert('Error al entrar: ' + errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                <h2 className="text-3xl font-serif text-center mb-8 text-primary-dark dark:text-primary-light">
                    Iniciar Sesión
                </h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Usuario o Correo
                        </label>
                        <input
                            type="text"
                            required
                            value={emailOrUser}
                            onChange={(e) => setEmailOrUser(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="tu@email.com o usuario"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Accediendo...' : 'Entrar'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    ¿No tienes una cuenta?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className="text-primary hover:underline font-medium"
                    >
                        Regístrate
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
