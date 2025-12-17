# Exergy Office Thermostat Dashboard

A secure, real-time thermostat dashboard that displays your Home Assistant climate data with Lightning Network QR codes. Built with a modern industrial aesthetic.

## Features

- **Real-time thermostat monitoring** - Updates every 30 seconds
- **Secure API handling** - Your Home Assistant token never touches the browser
- **Lightning QR codes** - Two scannable Lightning LNURL codes
- **Responsive design** - Works beautifully on desktop, tablet, and mobile
- **Visual indicators** - Color-coded heating/cooling states with animations

## Quick Start Guide

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like `exergy-thermostat` (or whatever you prefer)
3. Make it **Public** (required for free Vercel hosting)
4. Don't add README, .gitignore, or license yet

### Step 2: Upload Files to GitHub

Upload these files to your new repository:
- `index.html`
- `style.css`
- `script.js`
- `api/thermostat.js`
- `README.md` (this file)

**Option A: Via GitHub Web Interface**
1. Click "Add file" → "Upload files"
2. Drag all files into the upload area
3. Click "Commit changes"

**Option B: Via Git Command Line**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" and choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. Click "Add New..." → "Project"
5. Find your repository and click "Import"
6. Leave all settings as default
7. Click "Deploy"

### Step 4: Add Environment Variables

**CRITICAL STEP** - Your Home Assistant credentials need to be securely stored:

1. In Vercel, go to your project
2. Click "Settings" tab
3. Click "Environment Variables" in the left sidebar
4. Add these three variables:

| Name | Value | Notes |
|------|-------|-------|
| `HA_URL` | `https://demo.exergyheat.com` | Your Home Assistant URL (no trailing slash) |
| `HA_TOKEN` | `yourtokenkey...` | Your Long-Lived Access Token |
| `ENTITY_ID` | `climate.exergy_office` | Your thermostat entity ID |

5. Make sure to select "Production", "Preview", and "Development" for each variable
6. Click "Save"

### Step 5: Redeploy

1. Go to "Deployments" tab
2. Click the three dots (...) on your latest deployment
3. Click "Redeploy"
4. Check "Use existing Build Cache"
5. Click "Redeploy"

### Step 6: Visit Your Site!

Your dashboard will be live at: `https://your-project-name.vercel.app`

## Security Notes

### How Your Token is Protected

✅ **Token stored in Vercel's encrypted environment variables**  
✅ **Token only used on Vercel's servers (backend)**  
✅ **Browser only receives thermostat data, never the token**  
✅ **GitHub repository contains zero secrets**

Even if someone:
- Views your website source code
- Inspects network traffic
- Clones your GitHub repo

They will **never** see your Home Assistant URL or access token.

### Additional Security Recommendations

1. **Use HTTPS for Home Assistant**
   - If using Nabu Casa, you're already set
   - If self-hosted, use a reverse proxy (Nginx/Caddy) with Let's Encrypt

2. **Restrict Home Assistant Access**
   - Use firewall rules to limit external access
   - Consider Tailscale or WireGuard VPN
   - Enable fail2ban for failed login attempts

3. **Monitor Token Usage**
   - Regularly check Home Assistant logs
   - Rotate tokens periodically
   - Revoke tokens if compromised

## 🛠️ Customization

### Change Refresh Rate

Edit `script.js` line 5:
```javascript
REFRESH_INTERVAL: 30000, // milliseconds (30000 = 30 seconds)
```

### Change QR Codes

The QR codes are hardcoded in `script.js` lines 6-9. To change them:
1. Edit the `CONFIG.QR_CODES` array
2. Commit and push to GitHub
3. Vercel will auto-deploy

### Customize Colors

All colors are defined as CSS variables in `style.css` lines 1-14. You can easily change the entire color scheme by modifying these values.

### Change Temperature Units

Currently displays Fahrenheit. To change to Celsius:
1. Edit `index.html` line 23: Change `°F` to `°C`
2. Edit `script.js` line 63: Change `°F` to `°C`

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Troubleshooting

### "OFFLINE" Status

**Check these in order:**

1. **Vercel Environment Variables**
   - Go to Vercel → Settings → Environment Variables
   - Verify all three variables are set correctly
   - Make sure there are no extra spaces in values
   - Click "Redeploy" after any changes

2. **Home Assistant Connection**
   - Can you access your Home Assistant URL in a browser?
   - Is your token still valid? (Check HA Profile → Long-Lived Access Tokens)
   - Is the entity ID correct? (Check Developer Tools → States in HA)

3. **Browser Console**
   - Open Developer Tools (F12)
   - Check Console tab for error messages
   - Look for failed network requests

4. **Vercel Function Logs**
   - Go to Vercel → Deployments → Click your deployment
   - Scroll to "Function Logs" section
   - Look for error messages

### Temperature Shows "--"

This means the API call succeeded but the data format is unexpected:
- Verify your entity ID is a `climate` entity
- Check that the entity has `current_temperature` attribute
- View the raw API response in browser dev tools

### QR Codes Don't Scan

- Ensure the QR code content is valid
- Lightning URLs must start with `lightning:`
- Try scanning with different QR code apps

## 📄 File Structure

```
your-repo/
├── index.html          # Main HTML page
├── style.css           # Styling and animations
├── script.js           # Frontend logic and QR generation
├── api/
│   └── thermostat.js   # Vercel serverless function (SECURE!)
└── README.md           # This file
```

## Support

If you run into issues:
1. Check the troubleshooting section above
2. Review Vercel function logs
3. Verify your Home Assistant is accessible
4. Check that your token hasn't expired

## License

MIT License - Feel free to use and modify!

---

Built with ⚡ and ❄️ for the Exergy Office
