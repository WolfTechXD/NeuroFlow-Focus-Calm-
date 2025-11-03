import { supabase } from '../config/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthResponse {
    user: User | null;
    session: Session | null;
    error: AuthError | null;
}

export class AuthService {
    private static instance: AuthService;

    private constructor() {}

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async signUp(email: string, password: string, fullName?: string): Promise<AuthResponse> {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName || ''
                    }
                }
            });

            return {
                user: data.user,
                session: data.session,
                error: error
            };
        } catch (err) {
            console.error('Sign up error:', err);
            return {
                user: null,
                session: null,
                error: err as AuthError
            };
        }
    }

    async signIn(email: string, password: string): Promise<AuthResponse> {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            return {
                user: data.user,
                session: data.session,
                error: error
            };
        } catch (err) {
            console.error('Sign in error:', err);
            return {
                user: null,
                session: null,
                error: err as AuthError
            };
        }
    }

    async signInWithGoogle(): Promise<AuthResponse> {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            });

            if (error) {
                if (error.message.includes('provider') || error.message.includes('not enabled')) {
                    const customError: any = new Error(
                        'Google sign-in is not configured yet. Please use email/password or try demo mode.'
                    );
                    customError.status = 400;
                    return {
                        user: null,
                        session: null,
                        error: customError as AuthError
                    };
                }
            }

            return {
                user: null,
                session: null,
                error: error
            };
        } catch (err: any) {
            console.error('Google sign in error:', err);

            const friendlyError: any = new Error(
                err.message?.includes('provider') || err.message?.includes('not enabled')
                    ? 'Google sign-in is not configured yet. Please use email/password or try demo mode.'
                    : 'Failed to sign in with Google. Please try again or use email/password.'
            );

            return {
                user: null,
                session: null,
                error: friendlyError as AuthError
            };
        }
    }

    async signOut(): Promise<{ error: AuthError | null }> {
        try {
            const { error } = await supabase.auth.signOut();
            return { error };
        } catch (err) {
            console.error('Sign out error:', err);
            return { error: err as AuthError };
        }
    }

    async resetPassword(email: string): Promise<{ error: AuthError | null }> {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            });
            return { error };
        } catch (err) {
            console.error('Password reset error:', err);
            return { error: err as AuthError };
        }
    }

    async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            return { error };
        } catch (err) {
            console.error('Password update error:', err);
            return { error: err as AuthError };
        }
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            return user;
        } catch (err) {
            console.error('Get current user error:', err);
            return null;
        }
    }

    async getCurrentSession(): Promise<Session | null> {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            return session;
        } catch (err) {
            console.error('Get current session error:', err);
            return null;
        }
    }

    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }
}

export const authService = AuthService.getInstance();
