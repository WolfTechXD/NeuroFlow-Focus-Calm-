# Detailed Google Cloud Console Setup - Step by Step

This guide shows you EXACTLY where to click in Google Cloud Console.

---

## Starting Point

You're at: **https://console.cloud.google.com/**
You've created your project "NeuroFlow" and it's selected.

---

## Step 1: Find the Navigation Menu

1. Look at the **top-left corner** of the screen
2. You'll see three horizontal lines (☰) - this is the "hamburger menu"
3. Click on it to open the navigation sidebar

---

## Step 2: Enable Google+ API (Optional but Recommended)

1. In the navigation sidebar, find and click **"APIs & Services"**
2. Click **"Library"** (it's a submenu under "APIs & Services")
3. You'll see a search bar at the top
4. Type: **"Google+ API"** or **"Google Identity"**
5. Click on **"Google+ API"** from the results
6. Click the blue **"ENABLE"** button
7. Wait 5-10 seconds for it to enable
8. You'll see a green checkmark when it's done

---

## Step 3: Configure OAuth Consent Screen

### 3a. Navigate to OAuth Consent Screen

1. Click the hamburger menu (☰) again
2. Click **"APIs & Services"**
3. Click **"OAuth consent screen"** (in the left sidebar)

### 3b. Choose User Type

You'll see a page asking "User Type":

- **Internal**: Only for Google Workspace users (your organization only)
- **External**: For anyone with a Google account ✅ **Choose this one**

1. Select **"External"**
2. Click the blue **"CREATE"** button at the bottom

### 3c. Fill Out App Information (Page 1 of 4)

You'll now see a form with several sections:

#### OAuth consent screen section:

1. **App name**: Type `NeuroFlow Focus & Calm`
2. **User support email**: Click the dropdown and select your email

#### App domain section (Optional - you can skip these):

3. **App logo**: Skip for now (click "Choose File" only if you have a logo)
4. **Application home page**: Leave blank
5. **Application privacy policy link**: Leave blank
6. **Application terms of service link**: Leave blank

#### Authorized domains section:

7. Leave blank for now (you'll add your domain later when you have one)

#### Developer contact information:

8. **Email addresses**: Type your email address

9. Scroll to the bottom and click **"SAVE AND CONTINUE"**

### 3d. Add Scopes (Page 2 of 4)

1. Click the **"ADD OR REMOVE SCOPES"** button
2. A panel will slide in from the right side
3. Scroll through the list and **check the boxes** for these 3 scopes:
   - Find: `.../auth/userinfo.email` ✅ Check this
   - Find: `.../auth/userinfo.profile` ✅ Check this
   - Find: `openid` ✅ Check this
4. Scroll to the bottom of the panel
5. Click the blue **"UPDATE"** button
6. The panel will close
7. Click **"SAVE AND CONTINUE"** at the bottom

### 3e. Add Test Users (Page 3 of 4)

1. Click the **"+ ADD USERS"** button
2. A small popup will appear
3. Type your email address (the one you'll use to test sign-in)
4. Press Enter or click outside the box
5. Add any other test emails if you want (optional)
6. Click **"ADD"** in the popup
7. Click **"SAVE AND CONTINUE"** at the bottom

### 3f. Review Summary (Page 4 of 4)

1. Review all your settings (just look them over)
2. Click **"BACK TO DASHBOARD"** at the bottom

---

## Step 4: Create OAuth 2.0 Credentials

### 4a. Navigate to Credentials

1. Click the hamburger menu (☰) again
2. Click **"APIs & Services"**
3. Click **"Credentials"** (in the left sidebar)

### 4b. Create New Credentials

1. Look at the top of the page
2. Click the **"+ CREATE CREDENTIALS"** button
3. A dropdown menu will appear
4. Select **"OAuth client ID"**

### 4c. Configure OAuth Client

You'll see a form titled "Create OAuth client ID":

1. **Application type**: Click the dropdown and select **"Web application"**

2. **Name**: Type `NeuroFlow Web Client`

3. Scroll down to **"Authorized JavaScript origins"**:
   - Click **"+ ADD URI"**
   - Type: `http://localhost:5173`
   - Click **"+ ADD URI"** again
   - Type: `http://localhost:4173`
   - Click **"+ ADD URI"** again
   - Type: `https://ceeegmcfgqzzhqzzauye.supabase.co`

4. Scroll down to **"Authorized redirect URIs"**:
   - Click **"+ ADD URI"**
   - Type: `https://ceeegmcfgqzzhqzzauye.supabase.co/auth/v1/callback`
   - Make sure this is EXACT - copy and paste it to be safe

5. Scroll to the bottom and click the blue **"CREATE"** button

### 4d. Save Your Credentials

A popup will appear with your credentials:

1. You'll see:
   - **Your Client ID**: Something like `123456789-abc123def456.apps.googleusercontent.com`
   - **Your Client Secret**: Something like `GOCSPX-abc123xyz789`

2. **IMPORTANT**:
   - Click the copy icon next to Client ID to copy it
   - Paste it somewhere safe (Notepad, Notes app, etc.)
   - Click the copy icon next to Client Secret to copy it
   - Paste it somewhere safe

3. Click **"OK"** to close the popup

---

## Step 5: Verify Your Credentials

You should now see your credentials listed:

1. Look for a table/list with your credential name: "NeuroFlow Web Client"
2. You should see:
   - **Name**: NeuroFlow Web Client
   - **Type**: Web application
   - **Client ID**: Your long client ID

3. If you need to see your credentials again:
   - Click on the credential name
   - Your Client ID and Client Secret will be shown

---

## What You Should Have Now

✅ OAuth consent screen configured
✅ Test users added
✅ OAuth 2.0 credentials created
✅ Client ID copied and saved
✅ Client Secret copied and saved

---

## Next Steps

Now go to Part 2 in the main guide: Configure Supabase with these credentials.

You'll need:
- Client ID (the long one you copied)
- Client Secret (starts with GOCSPX-)

---

## Visual Landmarks to Help You Navigate

### How to identify the hamburger menu:
```
☰  Google Cloud
```
Top-left corner, looks like three stacked lines

### How to identify you're in the right place:

**APIs & Services > OAuth consent screen**
- URL will contain: `/apis/credentials/consent`
- Page title at top: "OAuth consent screen"

**APIs & Services > Credentials**
- URL will contain: `/apis/credentials`
- Page title at top: "Credentials"
- You'll see "+ CREATE CREDENTIALS" button

**APIs & Services > Library**
- URL will contain: `/apis/library`
- Page title at top: "API Library"
- You'll see a search bar and lots of API cards

---

## Stuck? Here's How to Get Back on Track

### If you closed the tab:
1. Go back to https://console.cloud.google.com/
2. Make sure your project "NeuroFlow" is selected (check the dropdown at the top)
3. Follow the navigation steps above

### If you can't find the hamburger menu:
1. Look for the Google Cloud logo at the very top-left
2. The three lines (☰) should be right next to it
3. Try refreshing the page

### If you don't see "APIs & Services":
1. Click the hamburger menu (☰)
2. Scroll down in the sidebar
3. It's usually in the middle section
4. Look for an icon that looks like a gear or puzzle piece

### If the page looks different:
1. Google Cloud Console occasionally updates its design
2. The menu names stay the same: "OAuth consent screen", "Credentials", "Library"
3. Look for these exact words in the sidebar or navigation

---

## Need to Go Back and Edit?

### To edit OAuth consent screen:
1. Hamburger menu (☰) > APIs & Services > OAuth consent screen
2. Click "EDIT APP" button
3. Make changes
4. Click through "SAVE AND CONTINUE" on each page

### To edit or view credentials:
1. Hamburger menu (☰) > APIs & Services > Credentials
2. Click on the credential name "NeuroFlow Web Client"
3. Make changes
4. Click "SAVE" at the bottom

### To add more redirect URIs later:
1. Go to Credentials
2. Click "NeuroFlow Web Client"
3. Scroll to "Authorized redirect URIs"
4. Click "+ ADD URI"
5. Add the new URI
6. Click "SAVE"

---

**You're now ready to move to Part 2: Supabase Configuration!**
