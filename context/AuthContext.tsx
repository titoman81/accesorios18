import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    role: 'user' | 'admin' | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<'user' | 'admin' | null>(() => {
        // Try to recover role from localStorage to avoid flickering
        return localStorage.getItem('user_role') as 'user' | 'admin' | null;
    });
    const [loading, setLoading] = useState(true);

    const fetchRole = async (userId: string) => {
        try {
            console.log('[AuthContext] Fetching role for UID:', userId);

            const rolePromise = supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            // Set a 10-second timeout for role fetching
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Tiempo de espera agotado al obtener el rol')), 10000)
            );

            const { data, error } = await Promise.race([rolePromise, timeoutPromise]) as any;

            if (error) {
                console.error('[AuthContext] Error fetching profile:', error.message);
                setRole('user');
                localStorage.setItem('user_role', 'user');
            } else if (data) {
                console.log('[AuthContext] Role found in DB:', data.role);
                const newRole = data.role as 'user' | 'admin';
                setRole(newRole);
                localStorage.setItem('user_role', newRole);
            } else {
                console.warn('[AuthContext] No profile found for user, defaulting to user');
                setRole('user');
                localStorage.setItem('user_role', 'user');
            }
        } catch (err: any) {
            console.error('[AuthContext] Error o Timeout en fetchRole:', err.message);
            // No degradamos a 'user' si ya tenemos algo en el estado o localStorage
            // a menos que el error sea explícito de "no encontrado"
            if (!role) {
                setRole('user');
                localStorage.setItem('user_role', 'user');
            }
        } finally {
            setLoading(false);
            console.log('[AuthContext] Finalizado proceso de carga. Rol actual:', role);
        }
    };

    useEffect(() => {
        let active = true;

        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!active) return;

            if (session) {
                setUser(session.user);
                await fetchRole(session.user.id);
            } else {
                setUser(null);
                setRole(null);
                setLoading(false);
            }
        };

        getInitialSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('[AuthContext] Event:', event);
            if (!active) return;

            if (session) {
                setUser(session.user);
                await fetchRole(session.user.id);
            } else {
                setUser(null);
                setRole(null);
                localStorage.removeItem('user_role');
                setLoading(false);
            }
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            alert('Has cerrado sesión correctamente');
        } catch (err) {
            console.error('[AuthContext] Error signing out:', err);
        } finally {
            setUser(null);
            setRole(null);
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
