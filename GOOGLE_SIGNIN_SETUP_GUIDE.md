# Complete Google Sign-In Setup Guide for NeuroFlow

This guide will walk you through setting up Google Sign-In for your NeuroFlow app in approximately 10-15 minutes.

---

## Part 1: Google Cloud Console Setup (5-7 minutes)

### Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. If you don't have a project yet, you'll be prompted to create one

### Step 2: Create a New Project (or Select Existing)

1. Click the project dropdown at the top of the page (next to "Google Cloud")
2. Click "NEW PROJECT" button
3. Enter project details:
   - **Project name**: `NeuroFlow` (or any name you prefer)
   - **Organization**: Leave as default (optional)
4. Click "CREATE"
5. Wait for the project to be created (takes ~10 seconds)
6. Make sure your new project is selected in the project dropdown

### Step 3: Enable Required APIs

1. In the left sidebar, click "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity Services"
3. Click on it and press "ENABLE" if not already enabled
4. Wait for it to enable (takes ~5 seconds)

### Step 4: Configure OAuth Consent Screen

1. In the left sidebar, click "APIs & Services" → "OAuth consent screen"
2. Select user type:
   - Choose **"External"** (allows anyone with a Google account to sign in)
   - Click "CREATE"

3. Fill in the OAuth consent screen (Page 1):
   - **App name**: `NeuroFlow Focus & Calm`
   - **User support email**: Your email address (select from dropdown)
   - **App logo**: (Optional - you can skip this for now)
   - **App domain** section: (Optional - you can skip for now)
   - **Authorized domains**: (Leave empty for now, add your domain later when you have one)
   - **Developer contact information**: Your email address
   - Click "SAVE AND CONTINUE"

4. Scopes (Page 2):
   - Click "ADD OR REMOVE SCOPES"
   - Select these scopes:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `openid`
   - Click "UPDATE"
   - Click "SAVE AND CONTINUE"

5. Test users (Page 3):
   - Click "ADD USERS"
   - Add your email address and any other test accounts
   - Click "ADD"
   - Click "SAVE AND CONTINUE"

6. Summary (Page 4):
   - Review your settings
   - Click "BACK TO DASHBOARD"

### Step 5: Create OAuth 2.0 Credentials

1. In the left sidebar, click "APIs & Services" → "Credentials"
2. Click "CREATE CREDENTIALS" at the top
3. Select "OAuth client ID"
4. Configure the OAuth client:
   - **Application type**: Select "Web application"
   - **Name**: `NeuroFlow Web Client`

5. Add **Authorized JavaScript origins**:
   - Click "+ ADD URI" under "Authorized JavaScript origins"
   - Add these URIs one by one (press "+ ADD URI" for each):
     ```
     http://localhost:5173
     http://localhost:4173
     https://ceeegmcfgqzzhqzzauye.supabase.co
     ```
   - If you have a production domain, add it too:
     ```
     https://yourdomain.com
     ```

6. Add **Authorized redirect URIs**:
   - Click "+ ADD URI" under "Authorized redirect URIs"
   - Add this URI (this is your Supabase callback URL):
     ```
     https://ceeegmcfgqzzhqzzauye.supabase.co/auth/v1/callback
     ```
   - If you have a production domain, also add:
     ```
     https://yourdomain.com/auth/callback
     ```

7. Click "CREATE"

### Step 6: Save Your Credentials

1. A popup will appear with your credentials:
   - **Client ID**: Something like `123456789-abc123.apps.googleusercontent.com`
   - **Client Secret**: Something like `GOCSPX-abc123xyz789`
2. **IMPORTANT**: Copy both values - you'll need them in the next steps
3. Click "OK" to close the popup
4. You can always access these credentials later from the "Credentials" page

---

## Part 2: Supabase Configuration (3-5 minutes)

### Step 7: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `ceeegmcfgqzzhqzzauye` (or find it in your projects list)

### Step 8: Enable Google OAuth Provider

1. In the left sidebar, click "Authentication"
2. Click on "Providers" tab
3. Scroll down and find "Google" in the list
4. Click on "Google" to expand it

### Step 9: Configure Google Provider

1. Toggle the "Enable Sign in with Google" switch to **ON**
2. Fill in the configuration:
   - **Client ID (for OAuth)**: Paste the Client ID from Step 6
   - **Client Secret (for OAuth)**: Paste the Client Secret from Step 6
   - **Authorized Client IDs**: (Optional - can leave empty)
   - **Skip nonce check**: Leave unchecked
3. Click "Save" at the bottom

### Step 10: Verify Callback URL

1. Still on the Google provider settings page, you should see:
   - **Callback URL (for OAuth)**: `https://ceeegmcfgqzzhqzzauye.supabase.co/auth/v1/callback`
2. Make sure this matches the redirect URI you added in Google Cloud Console (Step 5, part 6)

---

## Part 3: Update Your Application (2 minutes)

### Step 11: Update Environment Variables

1. Open your `.env` file in your project root
2. Find the line that says:
   ```
   VITE_GOOGLE_CLIENT_ID=
   ```
3. Add your Google Client ID after the `=`:
   ```
   VITE_GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
   ```
4. Save the file

### Step 12: Restart Development Server

1. Stop your development server if it's running (press `Ctrl+C` in terminal)
2. Restart it:
   ```bash
   npm run dev
   ```
3. Wait for the server to start

---

## Part 4: Test Google Sign-In (2 minutes)

### Step 13: Test the Sign-In Flow

1. Open your browser and go to: `http://localhost:5173`
2. Navigate to the Sign In page
3. Click the "Continue with Google" button
4. You should see the Google account picker
5. Select your Google account
6. Grant permissions when prompted
7. You should be redirected back to your app and signed in!

### Step 14: Verify in Supabase

1. Go back to Supabase Dashboard
2. Click "Authentication" → "Users"
3. You should see your Google account listed as a new user
4. Check that the email and name are correct

---

## Troubleshooting Common Issues

### Issue 1: "redirect_uri_mismatch" Error

**Problem**: The redirect URI in your request doesn't match what's configured in Google Cloud Console.

**Solution**:
1. Go back to Google Cloud Console → Credentials
2. Click on your OAuth client ID
3. Verify the redirect URI is exactly: `https://ceeegmcfgqzzhqzzauye.supabase.co/auth/v1/callback`
4. Make sure there are no extra spaces or typos
5. Click "SAVE"
6. Wait 5 minutes for changes to propagate

### Issue 2: "invalid_client" Error

**Problem**: The Client ID or Client Secret in Supabase doesn't match Google Cloud Console.

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Copy the Client ID and Client Secret again
3. Go to Supabase → Authentication → Providers → Google
4. Re-paste both values
5. Click "Save"
6. Try signing in again

### Issue 3: "Access blocked: This app's request is invalid"

**Problem**: OAuth consent screen not properly configured or app is not verified.

**Solution**:
1. Go to Google Cloud Console → OAuth consent screen
2. Make sure all required fields are filled in
3. For development, make sure your test users are added
4. For production, you'll need to submit for verification (only if you need more than 100 users)

### Issue 4: "Google sign-in is not configured yet" Message

**Problem**: Google provider not enabled in Supabase or credentials are wrong.

**Solution**:
1. Verify Google provider is enabled in Supabase (toggle should be ON)
2. Check that Client ID and Secret are correctly pasted
3. Make sure there are no extra spaces before/after the credentials
4. Save and try again

### Issue 5: User is Created but Not Logged In

**Problem**: Supabase created the user but session wasn't established.

**Solution**:
1. Check browser console for errors
2. Make sure `detectSessionInUrl` is enabled in `src/config/supabase.ts` (it already is)
3. Clear browser cookies and try again
4. Check Supabase Auth logs for more details

### Issue 6: "localhost" Not Allowed

**Problem**: Testing locally but localhost isn't in authorized origins.

**Solution**:
1. Go to Google Cloud Console → Credentials → Your OAuth Client
2. Add `http://localhost:5173` to Authorized JavaScript origins
3. Save and wait 5 minutes
4. Try again

---

## Production Deployment Checklist

When you're ready to deploy to production:

### ✅ Before Deployment:

1. **Update Google Cloud Console**:
   - Add your production domain to Authorized JavaScript origins
   - Add `https://yourdomain.com/auth/callback` to Authorized redirect URIs

2. **Update OAuth Consent Screen**:
   - Add your domain to Authorized domains
   - Fill in Privacy Policy URL
   - Fill in Terms of Service URL

3. **Publishing OAuth Consent Screen** (if needed):
   - If you need more than 100 users, submit for verification
   - This can take 1-6 weeks for Google to review
   - For development/testing, you can stay in "Testing" mode

4. **Environment Variables**:
   - Make sure `VITE_GOOGLE_CLIENT_ID` is set in your production environment
   - Never commit the `.env` file to version control

5. **Test Production**:
   - Test sign-in on your production domain
   - Verify users are created in Supabase
   - Check that redirect works correctly

---

## Security Best Practices

1. **Never commit secrets**: Keep `.env` in `.gitignore`
2. **Use environment variables**: Different credentials for dev/staging/production
3. **Rotate credentials**: If credentials are ever exposed, regenerate them immediately
4. **Monitor usage**: Check Google Cloud Console for unusual activity
5. **Limit scopes**: Only request the permissions you need (email and profile)
6. **Review users**: Regularly check Supabase user list for suspicious accounts

---

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Sign-In Best Practices](https://developers.google.com/identity/sign-in/web/sign-in)

---

## Need Help?

If you encounter any issues not covered in this guide:

1. Check the browser console for error messages
2. Check Supabase Auth logs in the dashboard
3. Check Google Cloud Console logs
4. Review the error message carefully - it usually tells you what's wrong

---

## Quick Reference

### Important URLs:
- **Google Cloud Console**: https://console.cloud.google.com/
- **Supabase Dashboard**: https://supabase.com/dashboard/project/ceeegmcfgqzzhqzzauye
- **Your Supabase Callback**: https://ceeegmcfgqzzhqzzauye.supabase.co/auth/v1/callback

### Files Modified:
- `.env` - Added Google Client ID
- `src/hooks/useGoogleAuth.ts` - Updated to use real OAuth
- `src/pages/SignIn.tsx` - Uses real Google auth
- `src/pages/SignUp.tsx` - Uses real Google auth

---

**Congratulations!** 🎉 Once you complete these steps, your users will be able to sign in with Google!
