# Vercel Deployment Guide

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Firebase configuration ready

## Deployment Steps

1. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository

2. **Configure Project**
   - Project Name: Choose a name for your project
   - Framework Preset: Next.js (should be auto-detected)
   - Root Directory: `./` (default)

3. **Environment Variables**
   Add the following environment variables in Vercel dashboard:

   ```plaintext
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build and deployment to complete

## Automatic Deployments

Vercel automatically deploys:
- Every push to main/master branch
- Pull requests (preview deployments)

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

- If build fails, check build logs in Vercel dashboard
- Verify environment variables are correctly set
- Ensure all dependencies are properly listed in package.json
- Check if vercel.json configuration is correct

## Monitoring

- Use Vercel Analytics for performance monitoring
- Check deployment status in Vercel dashboard
- Monitor build and deployment logs

## Development Workflow

1. Make changes locally
2. Test using `npm run dev`
3. Commit and push changes
4. Vercel automatically deploys

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)