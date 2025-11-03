import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import ThemedApp from './ThemedApp.tsx'
import Welcome from './pages/Welcome'
import GetStarted from './pages/GetStarted'
import Login from './pages/Login'
import PaymentHub from './pages/PaymentHub'
import './index.css'

console.log('NeuroFlow: Testing ZenMode with enhanced pink theme...');

// Add error monitoring for production
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

const root = document.getElementById('root');
if (!root) {
    console.error('Root element not found!');
    document.body.innerHTML = '<div style="padding: 20px; background: #dc2626; color: white; text-align: center;"><h1>⚠️ Setup Error</h1><p>Root element not found</p></div>';
} else {
    try {
        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(
            <React.StrictMode>
                <ThemeProvider>
                    <AuthProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/welcome" element={<Welcome />} />
                                <Route path="/get-started" element={<GetStarted />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/payment" element={<PaymentHub />} />
                                <Route path="/dashboard" element={<ThemedApp />} />
                                <Route path="/app" element={<ThemedApp />} />
                                <Route path="/" element={<Welcome />} />
                                <Route path="*" element={<Navigate to="/welcome" replace />} />
                            </Routes>
                        </BrowserRouter>
                    </AuthProvider>
                </ThemeProvider>
            </React.StrictMode>
        );
        console.log('✅ NeuroFlow app initialized successfully!');
    } catch (error) {
        console.error('App initialization failed:', error);
        root.innerHTML = `
            <div style="padding: 20px; background: #dc2626; color: white; text-align: center; min-height: 100vh;">
                <h1>🚨 NeuroFlow Startup Error</h1>
                <p>Failed to initialize the application</p>
                <p><strong>Error:</strong> ${error.message}</p>
                <button onclick="location.reload()" style="background: white; color: #dc2626; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 15px;">Reload App</button>
            </div>
        `;
    }
}
