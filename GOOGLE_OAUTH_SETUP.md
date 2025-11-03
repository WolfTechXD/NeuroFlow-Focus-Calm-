# Google OAuth Setup Guide

This guide will help you enable Google authentication for your NeuroFlow app.

## Prerequisites
- Access to your Supabase project dashboard
- A Google Cloud Platform account

## Step 1: Set up Google OAuth credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application"
6. Add authorized redirect URIs:
   - `https://ceeegmcfgqzzhqzzauye.supabase.co/auth/v1/callback`
   - `http://localhost:5173/auth/callback` (for local development)
7. Save and copy your:
   - Client ID
   - Client Secret

## Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/project/ceeegmcfgqzzhqzzauye)
2. Navigate to "Authentication" > "Providers"
3. Find "Google" in the list
4. Enable the Google provider
5. Paste your Google Client ID
6. Paste your Google Client Secret
7. Click "Save"

## Step 3: Update Site URL (if needed)

1. In Supabase Dashboard, go to "Authentication" > "URL Configuration"
2. Ensure your Site URL is set correctly:
   - Production: Your actual domain
   - Development: `http://localhost:5173`
3. Add redirect URLs:
   - `http://localhost:5173/**`
   - `https://yourdomain.com/**`

## Step 4: Test the integration

1. Restart your development server: `npm run dev`
2. Navigate to the login page
3. Click "Continue with Google"
4. You should be redirected to Google's login page
5. After successful login, you'll be redirected back to your app

## Current Status

✅ Code is configured to use Supabase Google OAuth
❌ Google provider is currently disabled in Supabase (needs configuration)

## Troubleshooting

### "Google sign-in is not configured yet"
- This means Google OAuth is not enabled in Supabase
- Follow Steps 1-2 above to enable it

### "Redirect URI mismatch" error
- Check that your redirect URIs in Google Cloud Console match exactly
- Make sure to include both production and development URLs

### User gets redirected but not signed in
- Check browser console for errors
- Ensure your Supabase project is on a paid plan (if required for OAuth)
- Verify that the callback URL is correctly configured

## Alternative: Demo Mode

While setting up Google OAuth, users can:
- Use email/password authentication (already working)
- Try Demo Mode (no authentication required)

## Support

For more information, visit:
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
