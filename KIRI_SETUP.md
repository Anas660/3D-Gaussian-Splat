# KIRI Engine API Setup Guide

This guide explains how to configure your Fields Dashboard application with the KIRI Engine API.

## Getting Your API Key

1. Visit [KIRI Engine](https://www.kiriengine.app/)
2. Sign up or log in to your account
3. Navigate to the API section in your dashboard
4. Generate a new API key
5. Copy the key (you'll only see it once!)

## Configuration

### Step 1: Create Environment File

In the project root directory, create a file named `.env.local`:

```bash
cp .env.local.example .env.local
```

### Step 2: Add Your API Key

Open `.env.local` and add your KIRI Engine API key:

```env
KIRI_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_KIRI_API_BASE=https://api.kiriengine.app/api/
```

### Step 3: Restart Development Server

If the dev server is running, stop it and restart:

```bash
npm run dev
```

## Verification

To verify your setup is working:

1. Start the development server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Try uploading a small test file
4. Check the browser console for any API errors
5. Monitor the network tab to see API requests

## Troubleshooting

### "KIRI API key not configured" Error

- Ensure `.env.local` file exists in the project root
- Verify `KIRI_API_KEY=your_key_here` is set correctly
- Restart the development server after adding the key
- Check that there are no extra spaces in the file

### "Task Creation Failed" Error

- Verify your API key is correct (no typos or extra spaces)
- Ensure your KIRI account is active and has credits
- Check the browser console for the specific error message
- Review API logs at https://docs.kiriengine.app/

### "Failed to Load 3D Model" Error

- The processing might still be in progress
- Verify the PLY file exists at the provided URL
- Check browser WebGL2 support (most modern browsers)
- Try refreshing the page

## API Rate Limits

- Check KIRI documentation for rate limits
- Implement retry logic for API calls (already done in the app)
- Monitor your API usage in the KIRI dashboard

## Testing with Sample Files

For testing, use small files first:

- Small video: 30 seconds of 720p video (~50-100MB)
- Image: Single high-quality image (2-4MB)
- Image set: 5-10 images of the same object

Processing time varies based on:

- File size and quality
- Current KIRI queue length
- Selected processing quality

## Security Best Practices

- **Never commit** `.env.local` to git (it's in `.gitignore`)
- **Never share** your API key publicly
- **Use different keys** for development and production
- **Rotate keys** periodically for security

## Production Deployment

### Environment Variables

Set these environment variables in your hosting platform:

```
KIRI_API_KEY=your_production_api_key_here
NEXT_PUBLIC_KIRI_API_BASE=https://api.kiriengine.app/api/
```

### Vercel

If deploying on Vercel:

1. Go to Project Settings → Environment Variables
2. Add `KIRI_API_KEY` with your production key
3. Redeploy

### Other Platforms (AWS, Heroku, etc.)

Consult your platform's documentation for setting environment variables.

## API Documentation

For complete API documentation, visit: https://docs.kiriengine.app/

Key endpoints used by the application:

- `POST /v1/task/create` - Create a 3D processing task
- `GET /v1/task/{taskId}` - Get task status
- `GET /v1/task/{taskId}/download` - Download results

## Support

If you encounter issues:

1. Check the KIRI Engine API documentation
2. Review the browser console for error messages
3. Verify your API key and configuration
4. Contact KIRI support at [their contact page](https://www.kiriengine.app/contact)

---

**Last Updated:** December 2025
