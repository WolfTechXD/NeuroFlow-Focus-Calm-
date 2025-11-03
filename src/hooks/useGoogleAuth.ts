import { useCallback } from 'react';
import { supabase } from '../config/supabase';

export interface GoogleUser {
    email: string;
    name: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    id?: string;
}

export const useGoogleAuth = (onSuccess: (user: GoogleUser) => void, onError?: (error: string) => void) => {
    const signInWithGoogle = useCallback(async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                }
            });

            if (error) {
                console.error('Google sign-in error:', error);
                onError?.(error.message || 'Failed to sign in with Google');
                return;
            }

            if (data) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const googleUser: GoogleUser = {
                        id: user.id,
                        email: user.email || '',
                        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
                        picture: user.user_metadata?.avatar_url || user.user_metadata?.picture,
                        given_name: user.user_metadata?.given_name,
                        family_name: user.user_metadata?.family_name,
                    };
                    onSuccess(googleUser);
                }
            }
        } catch (error) {
            console.error('Google authentication error:', error);
            onError?.('An unexpected error occurred during Google sign-in');
        }
    }, [onSuccess, onError]);

    return {
        signInWithGoogle,
    };
};

export const useGoogleAuthDemo = useGoogleAuth;