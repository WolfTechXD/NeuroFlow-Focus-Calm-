import { useCallback, useEffect } from 'react';
import { supabase } from '../config/supabase';

export interface GoogleUser {
    email: string;
    name: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    id?: string;
}

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    prompt: () => void;
                    renderButton: (element: HTMLElement, config: any) => void;
                };
            };
        };
    }
}

export const useGoogleAuth = (onSuccess: (user: GoogleUser) => void, onError?: (error: string) => void) => {
    const handleCredentialResponse = useCallback(async (response: any) => {
        try {
            const credential = response.credential;
            const payload = JSON.parse(atob(credential.split('.')[1]));

            const googleUser: GoogleUser = {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                given_name: payload.given_name,
                family_name: payload.family_name,
            };

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: googleUser.email,
                    password: `google_${payload.sub}`
                });

                if (error && error.message.includes('Invalid login')) {
                    const { error: signUpError } = await supabase.auth.signUp({
                        email: googleUser.email,
                        password: `google_${payload.sub}`,
                        options: {
                            data: {
                                full_name: googleUser.name,
                                avatar_url: googleUser.picture,
                                provider: 'google',
                            }
                        }
                    });

                    if (signUpError) {
                        throw signUpError;
                    }
                }

                onSuccess(googleUser);
            } catch (supabaseError: any) {
                console.error('Supabase error:', supabaseError);
                onSuccess(googleUser);
            }
        } catch (error: any) {
            console.error('Google authentication error:', error);
            onError?.(error.message || 'An unexpected error occurred during Google sign-in');
        }
    }, [onSuccess, onError]);

    useEffect(() => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

        if (!clientId) {
            console.warn('Google Client ID not configured');
            return;
        }

        const initializeGoogle = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                });
            }
        };

        if (window.google) {
            initializeGoogle();
        } else {
            const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
            if (script) {
                script.addEventListener('load', initializeGoogle);
            }
        }
    }, [handleCredentialResponse]);

    const signInWithGoogle = useCallback(() => {
        if (window.google) {
            window.google.accounts.id.prompt();
        } else {
            onError?.('Google Sign-In not loaded');
        }
    }, [onError]);

    return {
        signInWithGoogle,
    };
};

export const useGoogleAuthDemo = useGoogleAuth;