import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '../services/AuthService';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
    signInWithGoogle: () => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const currentSession = await authService.getCurrentSession();
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await authService.signIn(email, password);
        return { error };
    };

    const signUp = async (email: string, password: string, fullName?: string) => {
        const { error } = await authService.signUp(email, password, fullName);
        return { error };
    };

    const signInWithGoogle = async () => {
        const { error } = await authService.signInWithGoogle();
        return { error };
    };

    const signOut = async () => {
        await authService.signOut();
        setUser(null);
        setSession(null);
    };

    const resetPassword = async (email: string) => {
        const { error } = await authService.resetPassword(email);
        return { error };
    };

    const value: AuthContextType = {
        user,
        session,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
