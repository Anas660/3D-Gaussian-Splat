# Fields Dashboard - Quick Start Guide

Welcome! Your Fields Dashboard application is ready to use. Follow these steps to get started.

## Prerequisites

- **Node.js** 18+ (check with `node --version`)
- **npm** 9+ (check with `npm --version`)
- **KIRI Engine API Key** (get one at https://www.kiriengine.app/)

## Installation & Setup (5 minutes)

### 1. Configure KIRI API Key

```bash
# Copy the environment template
cp .env.local.example .env.local

# Open .env.local and add your API key
# KIRI_API_KEY=your_actual_api_key_here
```

### 2. Install Dependencies (if not already done)

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at **[http://localhost:3000](http://localhost:3000)**

## Using the Application

### Dashboard Overview

The main dashboard displays all your 3D captures in a responsive grid:

- 🟢 **Finished**: Ready to view in 3D
- 🔵 **Processing**: Currently being processed
- 🔴 **Failed**: Error during processing

### Processing a Capture

1. Click **"+ Create"** button in the top-right
2. **Drag and drop** a video or image file
   - Supported: MP4, MOV, AVI, WebM, JPG, PNG
   - Max size: 5GB
3. Monitor progress in the modal
4. Once complete, the capture appears in the dashboard

### Viewing 3D Models

1. Click any **"Finished"** capture card
2. **Interact** with the 3D model:
   - **Drag**: Rotate the model
   - **Scroll**: Zoom in/out
3. **Download** the PLY file if needed

### Searching Captures

Use the search bar at the top to filter captures by name.

## Project Structure

```
3dproject/
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── api/             # API routes (server-side)
│   │   ├── viewer/[id]/     # 3D viewer page
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Dashboard home
│   │   └── globals.css      # Styling
│   ├── components/          # React components
│   ├── lib/                 # Utilities (store, API client)
│   └── public/
│       ├── uploads/         # Uploaded files
│       └── models/          # Processed models
├── .env.local               # Your API key (DO NOT COMMIT)
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies
└── README.md                # Full documentation
```

## Development Commands

```bash
# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run TypeScript type checking
npm run lint
```

## API Endpoints

Your application provides these API endpoints:

### POST /api/upload

Upload a video or image file.

### POST /api/kiri/task/create

Create a 3D processing task with KIRI Engine.

### GET /api/kiri/task/status

Poll the status of a processing task.

## Storage

Currently uses local filesystem:

- **Uploads**: `public/uploads/`
- **Models**: Cached from KIRI API output

For production, consider:

- AWS S3 integration
- Firebase Storage
- Cloudinary

## Troubleshooting

### API Key Issues

```
Error: "KIRI API key not configured"
→ Check .env.local file exists and has your key
→ Restart the dev server: npm run dev
```

### Upload Fails

```
Error: "Upload failed"
→ Check file size (max 5GB)
→ Verify file format (MP4, MOV, etc.)
→ Check browser console for details
```

### 3D Model Won't Load

```
Error: "Failed to load 3D model"
→ Verify processing completed (status is "Finished")
→ Check browser supports WebGL2
→ Refresh the page
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
npm install

# Try building again
npm run build
```

## Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Three.js Documentation](https://threejs.org)
- [KIRI Engine API](https://docs.kiriengine.app/)

## Environment Variables Reference

| Variable                    | Purpose                    | Required | Example                           |
| --------------------------- | -------------------------- | -------- | --------------------------------- |
| `KIRI_API_KEY`              | KIRI Engine authentication | Yes      | `sk_live_...`                     |
| `NEXT_PUBLIC_KIRI_API_BASE` | KIRI API endpoint          | No       | `https://api.kiriengine.app/api/` |

## Next Steps

1. ✅ Set up `.env.local` with your API key
2. ✅ Run `npm run dev`
3. ✅ Test with a small file upload
4. ✅ View the processed 3D model
5. 📚 Read full documentation in `README.md`
6. 🚀 Deploy to production (Vercel, AWS, etc.)

## Production Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
# Follow prompts, add environment variables in Vercel dashboard
```

### Other Platforms

Set these environment variables:

- `KIRI_API_KEY`: Your production API key
- `NEXT_PUBLIC_KIRI_API_BASE`: KIRI API endpoint

Then deploy the `npm run build` output.

## Support & Issues

For detailed information:

- 📖 See `README.md` for full documentation
- 🔧 See `KIRI_SETUP.md` for API configuration
- 🐛 Check `.github/copilot-instructions.md` for development guidelines

## Security Checklist

- ✅ Never commit `.env.local` to git (it's in `.gitignore`)
- ✅ Never share your API key publicly
- ✅ Use different keys for dev and production
- ✅ Rotate API keys periodically
- ✅ Keep dependencies updated: `npm update`

## Features Implemented

✨ Dashboard with responsive grid layout  
📤 Drag-and-drop file upload  
🔄 Real-time processing progress  
🎨 Interactive 3D point cloud viewer  
🔍 Search/filter captures  
⬇️ Download PLY model files  
🌙 Dark theme UI  
📱 Mobile responsive design

## Known Limitations

- Local file storage (not production-ready at scale)
- Simplified PLY parser (basic point cloud rendering)
- WebGL2 required for 3D rendering
- Processing speed depends on KIRI Engine queue

## Future Enhancements

- S3 cloud storage integration
- Advanced 3D viewer with annotations
- Batch processing support
- Model comparison tools
- Sharing/collaboration features

---

**Need help?** Check the README.md file or KIRI_SETUP.md for more details.

**Ready to get started?** Run `npm run dev` and open http://localhost:3000!
