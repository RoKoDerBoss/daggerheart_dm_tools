# Netlify Deployment Guide for Daggerheart DM Tools

This guide will help you deploy your Daggerheart DM Tools to Netlify with optimal performance and configuration.

## 🚀 Quick Deployment

### Option 1: Connect Git Repository (Recommended)

1. **Sign up/Log in to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up or log in with your GitHub account

2. **Connect Repository**
   - Click "New site from Git"
   - Choose GitHub and authorize Netlify
   - Select your `daggerheart_dm_tools` repository

3. **Configure Build Settings**
   Netlify should auto-detect the settings, but verify:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Node version**: `18.17.0` (set in Environment Variables)

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy automatically

### Option 2: Manual Deploy

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `out` folder to the deploy area

## ⚙️ Configuration Files Explained

### `netlify.toml`
- **Build settings**: Specifies build command and publish directory
- **Redirects**: Handles SPA routing for direct tool links
- **Headers**: Security and performance optimizations
- **Environment**: Node.js version and other variables

### `next.config.js`
- **Static export**: Configured for static hosting
- **Image optimization**: Disabled for static export compatibility
- **Build optimizations**: Console removal in production
- **Asset handling**: Proper static asset configuration

## 🔧 Environment Variables

Set these in your Netlify site settings (Site Settings → Environment Variables):

```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
SITE_URL=https://your-domain.netlify.app
```

## 🌐 Custom Domain Setup

1. **Purchase Domain** (optional)
   - Buy a domain from your preferred registrar

2. **Configure in Netlify**
   - Go to Site Settings → Domain Management
   - Click "Add custom domain"
   - Follow the DNS configuration instructions

3. **SSL Certificate**
   - Netlify automatically provides free SSL certificates
   - No additional configuration needed

## 📊 Performance Optimizations

### Already Configured:
- ✅ Static site generation for fast loading
- ✅ CSS and JS minification
- ✅ Image optimization disabled (required for static export)
- ✅ Proper caching headers
- ✅ Security headers
- ✅ Console removal in production

### Additional Optimizations:
1. **Enable Netlify Analytics** (paid feature)
2. **Configure Forms** if needed in the future
3. **Set up Split Testing** for A/B testing

## 🔍 SEO Configuration

The following files are configured for SEO:

- **`robots.txt`**: Search engine crawling instructions
- **`sitemap.ts`**: Dynamic sitemap generation
- **Metadata**: Proper meta tags in components

Update the `SITE_URL` environment variable with your actual domain.

## 🚨 Troubleshooting

### Build Fails
- Check Node.js version (should be 18.17.0+)
- Verify all dependencies are installed
- Check for TypeScript errors: `npm run type-check`

### Routes Don't Work
- Ensure `netlify.toml` redirects are configured
- Check that `generateStaticParams` is working in dynamic routes

### Images Not Loading
- Verify images are in the `public` directory
- Check that `unoptimized: true` is set in `next.config.js`

### Performance Issues
- Enable Netlify's build optimizations
- Check that CSS/JS minification is working
- Verify caching headers are set correctly

## 📱 Testing Before Deployment

1. **Local Build Test**
   ```bash
   npm run build
   npm run preview
   ```

2. **Type Checking**
   ```bash
   npm run type-check
   ```

3. **Linting**
   ```bash
   npm run lint
   ```

## 🔄 Continuous Deployment

Once connected to Git:

1. **Automatic Builds**
   - Every push to main branch triggers a build
   - Pull requests create deploy previews

2. **Build Notifications**
   - Configure Slack/email notifications in Site Settings
   - Monitor build status in Netlify dashboard

3. **Rollbacks**
   - Easy one-click rollbacks to previous deployments
   - Deploy previews for testing changes

## 🎯 Production Checklist

Before going live:

- [ ] Update `SITE_URL` environment variable
- [ ] Configure custom domain (if desired)
- [ ] Test all tool routes work correctly
- [ ] Verify mobile responsiveness
- [ ] Check SEO meta tags
- [ ] Test performance with Lighthouse
- [ ] Set up monitoring/analytics

## 📈 Post-Deployment

1. **Monitor Performance**
   - Use Netlify Analytics or Google Analytics
   - Monitor Core Web Vitals

2. **SEO**
   - Submit sitemap to Google Search Console
   - Monitor search engine indexing

3. **Updates**
   - Regular dependency updates
   - Monitor Netlify build status
   - Keep documentation updated

Your Daggerheart DM Tools should now be live and optimized for Netlify! 🎉 