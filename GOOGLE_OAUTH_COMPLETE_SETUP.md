# Google OAuth Setup Guide for NeuroFlow

## Prerequisites
- Supabase project (already configured)
- Google Cloud Console account

## Step 1: Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: NeuroFlow
   - User support email: Your email
   - Developer contact: Your email
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: NeuroFlow Web Client

7. Add Authorized JavaScript origins:
   ```
   http://localhost:5173
   http://localhost:4173
   https://your-production-domain.com
   ```

8. Add Authorized redirect URIs:
   ```
   https://ceeegmcfgqzzhqzzauye.supabase.co/auth/v1/callback
   http://localhost:5173
   https://your-production-domain.com
   ```

9. Copy your Client ID and Client Secret

## Step 2: Configure Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/ceeegmcfgqzzhqzzauye
2. Navigate to "Authentication" > "Providers"
3. Find "Google" in the provider list
4. Enable Google provider
5. Paste your Google Client ID
6. Paste your Google Client Secret
7. Click "Save"

## Step 3: Update Environment Variables

Add to your `.env` file:
```
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

## Step 4: Test the Integration

1. Run the development server: `npm run dev`
2. Navigate to the Sign In or Sign Up page
3. Click "Continue with Google"
4. Select a Google account
5. Grant permissions
6. You should be redirected back and signed in

## Troubleshooting

### "redirect_uri_mismatch" error
- Ensure the redirect URI in Google Console matches exactly with Supabase callback URL
- Check that you've added both development and production URLs

### "invalid_client" error
- Verify Client ID and Secret are correct in Supabase
- Check that OAuth consent screen is published

### User not created in Supabase
- Check Supabase Auth logs in Dashboard
- Ensure email domain is allowed in Supabase Auth settings

## Security Notes

- Never commit your Client Secret to version control
- Use environment variables for all sensitive data
- Keep your Google Cloud Console project secure
- Regularly review OAuth consent screen settings
