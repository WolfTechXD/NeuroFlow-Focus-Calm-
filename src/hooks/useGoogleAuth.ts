import { useEffect, useCallback } from 'react';

// Extend the global window object to include Google Identity Services
declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: GoogleInitConfig) => void;
                    prompt: () => void;
                    renderButton: (element: HTMLElement, config: GoogleButtonConfig) => void;
                    disableAutoSelect: () => void;
                };
            };
        };
    }
}

interface GoogleInitConfig {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
}

interface GoogleButtonConfig {
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    type?: 'standard' | 'icon';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    width?: string;
}

interface GoogleCredentialResponse {
    credential: string;
    select_by?: string;
}

interface GoogleUser {
    email: string;
    name: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
}

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE"; // Replace with your actual Client ID

export const useGoogleAuth = (onSuccess: (user: GoogleUser) => void, onError?: (error: string) => void) => {
    const handleCredentialResponse = useCallback((response: GoogleCredentialResponse) => {
        try {
            // Decode the JWT token (in production, validate this on your backend)
            const payload = JSON.parse(atob(response.credential.split('.')[1]));

            const user: GoogleUser = {
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                given_name: payload.given_name,
                family_name: payload.family_name,
            };

            onSuccess(user);
        } catch (error) {
            console.error('Failed to parse Google credential:', error);
            onError?.('Failed to process Google authentication');
        }
    }, [onSuccess, onError]);

    const initializeGoogleAuth = useCallback(() => {
        if (window.google && window.google.accounts) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true,
            });
        }
    }, [handleCredentialResponse]);

    useEffect(() => {
        // Initialize when Google SDK is loaded
        if (window.google) {
            initializeGoogleAuth();
        } else {
            // Wait for Google SDK to load
            const checkGoogleLoaded = () => {
                if (window.google) {
                    initializeGoogleAuth();
                } else {
                    setTimeout(checkGoogleLoaded, 100);
                }
            };
            checkGoogleLoaded();
        }
    }, [initializeGoogleAuth]);

    const signInWithGoogle = useCallback(() => {
        if (window.google && window.google.accounts) {
            window.google.accounts.id.prompt();
        } else {
            onError?.('Google authentication not available');
        }
    }, [onError]);

    const renderGoogleButton = useCallback((elementId: string, config?: GoogleButtonConfig) => {
        const element = document.getElementById(elementId);
        if (element && window.google && window.google.accounts) {
            window.google.accounts.id.renderButton(element, {
                theme: 'outline',
                size: 'large',
                type: 'standard',
                shape: 'rectangular',
                text: 'signin_with',
                width: '100%',
                ...config,
            });
        }
    }, []);

    return {
        signInWithGoogle,
        renderGoogleButton,
    };
};

// For demo purposes, we'll use a simulated version that shows a mock account picker
export const useGoogleAuthDemo = (onSuccess: (user: GoogleUser) => void, onError?: (error: string) => void) => {
    const signInWithGoogle = useCallback(() => {
        // Show a mock account selection dialog
        const mockAccounts = [
            { email: 'john.doe@gmail.com', name: 'John Doe', picture: '👨' },
            { email: 'jane.smith@gmail.com', name: 'Jane Smith', picture: '👩' },
            { email: 'alex.johnson@gmail.com', name: 'Alex Johnson', picture: '🧑' },
        ];

        // Create a custom modal for account selection
        const modal = document.createElement('div');
        modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    `;

        dialog.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style="width: 20px; height: 20px; margin-right: 8px;">
        <strong>Choose an account</strong>
      </div>
      <div style="font-size: 14px; color: #666; margin-bottom: 20px; text-align: center;">
        to continue to NeuroFlow
      </div>
      <div id="account-list"></div>
      <div style="text-align: center; margin-top: 16px;">
        <button id="cancel-btn" style="background: none; border: 1px solid #dadce0; color: #3c4043; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Cancel</button>
      </div>
    `;

        const accountList = dialog.querySelector('#account-list')!;

        mockAccounts.forEach(account => {
            const accountDiv = document.createElement('div');
            accountDiv.style.cssText = `
        display: flex;
        align-items: center;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        margin-bottom: 8px;
        transition: background-color 0.2s;
      `;

            accountDiv.addEventListener('mouseenter', () => {
                accountDiv.style.backgroundColor = '#f8f9fa';
            });

            accountDiv.addEventListener('mouseleave', () => {
                accountDiv.style.backgroundColor = 'transparent';
            });

            accountDiv.innerHTML = `
        <div style="font-size: 24px; margin-right: 12px; width: 40px; height: 40px; border-radius: 50%; background: #f1f3f4; display: flex; align-items: center; justify-content: center;">
          ${account.picture}
        </div>
        <div>
          <div style="font-weight: 500; color: #3c4043;">${account.name}</div>
          <div style="font-size: 14px; color: #5f6368;">${account.email}</div>
        </div>
      `;

            accountDiv.addEventListener('click', () => {
                document.body.removeChild(modal);
                onSuccess(account);
            });

            accountList.appendChild(accountDiv);
        });

        const cancelBtn = dialog.querySelector('#cancel-btn')!;
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        modal.appendChild(dialog);
        document.body.appendChild(modal);
    }, [onSuccess]);

    return {
        signInWithGoogle,
        renderGoogleButton: () => { }, // Not used in demo mode
    };
};