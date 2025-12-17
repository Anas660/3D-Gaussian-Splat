# Development Checklist

## Pre-Launch Checklist

### ✅ Configuration

- [ ] Create `.env.local` from `.env.local.example`
- [ ] Add KIRI Engine API key to `.env.local`
- [ ] Verify Node.js version 18+ installed
- [ ] Verify npm version 9+ installed

### ✅ Dependencies

- [ ] Run `npm install` (already done)
- [ ] Verify no audit vulnerabilities: `npm audit`
- [ ] Check all dependencies installed: `npm list`

### ✅ Build & Test

- [ ] Run `npm run build` successfully
- [ ] Start dev server: `npm run dev`
- [ ] Open http://localhost:3000 in browser
- [ ] Verify dashboard loads without errors
- [ ] Check browser console for errors
- [ ] Test responsive design on mobile

### ✅ File Upload

- [ ] Create modal opens when clicking "+ Create"
- [ ] Drag and drop accepts files
- [ ] File selection dialog works
- [ ] Upload progress bar displays
- [ ] Capture appears in dashboard after upload

### ✅ API Integration

- [ ] KIRI API key is valid and active
- [ ] API rate limits understood
- [ ] Error handling working properly
- [ ] Console shows API requests

### ✅ 3D Viewer

- [ ] Viewer page loads when clicking finished capture
- [ ] WebGL2 compatibility checked (run `webglreport.com`)
- [ ] Mouse controls work (drag to rotate)
- [ ] Zoom works (scroll wheel)
- [ ] Download button functions
- [ ] Model file downloads correctly

### ✅ Storage

- [ ] `public/uploads/` directory exists
- [ ] `public/models/` directory exists
- [ ] Files save correctly to uploads folder
- [ ] Understand local storage limitations

### ✅ UI/UX

- [ ] Dark theme applied correctly
- [ ] All text visible and readable
- [ ] Buttons responsive to clicks
- [ ] Hover effects working
- [ ] Mobile layout responsive

### ✅ Documentation

- [ ] README.md is up-to-date
- [ ] QUICKSTART.md provides clear instructions
- [ ] KIRI_SETUP.md has setup details
- [ ] Code comments are clear
- [ ] API documentation linked

## After First Upload

### Test Workflow

1. [ ] Upload a test video file
2. [ ] Verify upload completes
3. [ ] Check capture appears in dashboard with "Processing" status
4. [ ] Monitor progress polling (check network tab)
5. [ ] Wait for KIRI processing to complete
6. [ ] Verify status changes to "Finished"
7. [ ] Click capture to view 3D model
8. [ ] Rotate model with mouse
9. [ ] Download PLY file
10. [ ] Return to dashboard

## Before Production

### Security

- [ ] KIRI API key is secure (not in git)
- [ ] .env.local is in .gitignore
- [ ] No sensitive data in code
- [ ] Input validation working
- [ ] Error messages don't leak info

### Performance

- [ ] Build time < 30 seconds
- [ ] Page load time < 3 seconds
- [ ] 3D viewer loads smoothly
- [ ] No console errors or warnings
- [ ] Memory usage reasonable

### Scalability

- [ ] Plan for cloud storage (S3/Firebase)
- [ ] Plan for database (if needed)
- [ ] Consider rate limiting
- [ ] Plan CDN strategy
- [ ] Set up monitoring/logging

### Deployment

- [ ] Set up CI/CD pipeline
- [ ] Environment variables configured in hosting
- [ ] Database migrations planned
- [ ] Backup strategy defined
- [ ] Rollback plan ready

## Common Development Tasks

### Add New Component

```bash
# 1. Create component file
touch src/components/MyComponent.tsx

# 2. Add 'use client' if needed
# 3. Export component
# 4. Import in parent component
# 5. Test in dev server
npm run dev
```

### Add New API Route

```bash
# 1. Create route folder
mkdir src/app/api/myroute

# 2. Create route.ts
touch src/app/api/myroute/route.ts

# 3. Add handler (GET, POST, etc.)
# 4. Test with curl or browser
# 5. Check network tab in DevTools
```

### Update KIRI Integration

```bash
# 1. Update src/lib/kiri-api.ts (client)
# 2. Update src/app/api/kiri/ routes (server)
# 3. Test with actual API key
# 4. Monitor network requests
# 5. Check KIRI dashboard for task status
```

### Fix TypeScript Errors

```bash
# 1. Run type checker
npm run lint

# 2. Fix reported errors
# 3. Rebuild
npm run build

# 4. Test in dev server
npm run dev
```

## Debugging Techniques

### Browser DevTools

- **Console**: Check for errors and warnings
- **Network**: Monitor API requests
- **Application**: Check localStorage (captures saved)
- **Performance**: Profile slow operations

### Terminal

```bash
# Check build output
npm run build

# Run TypeScript check
npm run lint

# Clear cache and rebuild
rm -rf .next && npm run build
```

### Environment Check

```bash
# Verify Node.js
node --version  # Should be 18+

# Verify npm
npm --version   # Should be 9+

# Verify API key
grep KIRI_API_KEY .env.local
```

## Regular Maintenance

### Weekly

- [ ] Check for dependency updates: `npm outdated`
- [ ] Review error logs
- [ ] Test file uploads
- [ ] Monitor API usage

### Monthly

- [ ] Update dependencies: `npm update`
- [ ] Review and rotate API keys
- [ ] Back up user data
- [ ] Analyze usage patterns

### Quarterly

- [ ] Security audit: `npm audit`
- [ ] Performance review
- [ ] User feedback implementation
- [ ] Plan new features

## Useful Commands Reference

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Build for production
npm start                # Start production server

# Linting
npm run lint             # Check TypeScript

# Dependencies
npm install              # Install dependencies
npm update               # Update dependencies
npm audit                # Security audit
npm outdated             # Check for updates

# Cleaning
rm -rf .next             # Clear build cache
rm -rf node_modules      # Clear dependencies
npm install              # Reinstall everything
```

## Troubleshooting Reference

| Problem             | Solution                                 |
| ------------------- | ---------------------------------------- |
| "Module not found"  | Run `npm install` and restart            |
| TypeScript errors   | Run `npm run lint` and fix errors        |
| API key not working | Check `.env.local` and restart server    |
| 3D model won't load | Check file path, browser console, WebGL2 |
| Upload fails        | Check file size < 5GB, supported format  |
| Build fails         | Clear `.next`, reinstall, rebuild        |
| Slow performance    | Profile with DevTools, optimize code     |

---

**Last Updated:** December 2025

**Next Steps:**

1. Follow "Pre-Launch Checklist"
2. Complete "After First Upload" section
3. Run `npm run dev` to start development
4. Happy coding! 🚀
