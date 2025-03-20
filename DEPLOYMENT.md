# Deployment Guide

## Prerequisites

1. A [Firebase](https://firebase.google.com) account
2. Firebase CLI installed globally
3. Your Firebase project configuration

## Deployment Steps

1. **Install Firebase CLI** (if not already installed)
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory as 'out'
   - Configure as a single-page app: No
   - Set up automatic builds and deploys with GitHub: No

4. **Set up Environment Variables**
   
   Add your Firebase configuration to your project's environment variables:

   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

5. **Update next.config.mjs**
   
   Add the following to your next.config.mjs:
   ```javascript
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true
     }
   }
   ```

6. **Build the application**
   ```bash
   npm run build
   ```

7. **Deploy to Firebase**
   ```bash
   firebase deploy --only hosting
   ```

## Post-Deployment

1. Verify that your application is working correctly at the provided Firebase Hosting URL
2. Check that Firebase authentication and other features are functioning
3. Monitor the application in Firebase Console

## Troubleshooting

- If you encounter build errors, ensure all dependencies are installed
- Check that your Firebase configuration is correct
- Verify environment variables are properly set
- Make sure your Firebase project has Hosting enabled

## Production Considerations

- Set up [Custom Domains](https://firebase.google.com/docs/hosting/custom-domain)
- Enable [Cloud Functions](https://firebase.google.com/docs/functions) if needed
- Configure [Security Rules](https://firebase.google.com/docs/rules)
- Set up [Firebase Analytics](https://firebase.google.com/docs/analytics) for monitoring
- Consider using [Firebase Performance Monitoring](https://firebase.google.com/docs/perf-mon)