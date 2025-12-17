# Copilot Instructions for Fields Dashboard

## Project Overview
Fields Dashboard is a modern web application for uploading video/images and processing them into interactive 3D Gaussian Splats using the KIRI Engine API. Built with Next.js, React, Three.js, and Tailwind CSS.

## Technology Stack
- **Framework**: Next.js 14+ with TypeScript
- **UI**: React + Tailwind CSS (dark theme)
- **State**: Zustand
- **3D Rendering**: Three.js (PLY point cloud rendering)
- **API**: REST with Next.js API routes
- **Upload**: react-dropzone
- **External**: KIRI Engine API

## Project Structure
```
src/
├── app/
│   ├── api/              # Next.js API routes
│   │   ├── upload/       # File upload handler
│   │   └── kiri/         # KIRI API integration
│   ├── viewer/[id]/      # 3D viewer page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Dashboard
│   └── globals.css       # Global styles
├── components/
│   ├── Dashboard.tsx     # Main dashboard
│   ├── CaptureGrid.tsx   # Gallery grid
│   ├── CreateModal.tsx   # Upload modal
│   └── Viewer.tsx        # 3D viewer
└── lib/
    ├── store.ts          # Zustand store
    └── kiri-api.ts       # KIRI client
```

## Key Features
- Dark-themed responsive dashboard gallery
- Drag-and-drop file upload (MP4, MOV, AVI, WebM, JPG, PNG)
- KIRI Engine integration for 3D Gaussian Splat processing
- Real-time progress tracking
- Interactive 3D PLY viewer with mouse controls
- Local file storage (public/uploads/)
- Search/filter functionality

## Development Guidelines

### Code Style
- TypeScript for all components
- React functional components with hooks
- Tailwind CSS for styling (no separate CSS files)
- Client components prefixed with 'use client'
- Proper error handling and logging

### Component Patterns
- Store: Zustand for state management
- API: Next.js route handlers in app/api/
- UI: Reusable, dark-themed components
- 3D: Three.js with point cloud rendering

### Adding Features
1. Create components in src/components/
2. Use Zustand store for shared state
3. Add API routes in src/app/api/
4. Follow dark theme color scheme (bg-slate-950, etc.)
5. Ensure TypeScript type safety

### Environment Variables
```
KIRI_API_KEY=your_api_key_here
NEXT_PUBLIC_KIRI_API_BASE=https://api.kiriengine.app/api/
```

## Common Tasks

### Adding a new component
1. Create file in src/components/YourComponent.tsx
2. Use 'use client' directive if interactive
3. Add TypeScript interfaces
4. Export from the file

### Adding an API route
1. Create folder structure in src/app/api/
2. Add route.ts with appropriate HTTP method handlers
3. Import { NextRequest, NextResponse } from 'next/server'
4. Handle errors appropriately

### Modifying the KIRI integration
- Update src/lib/kiri-api.ts for client-side calls
- Update src/app/api/kiri/ routes for server-side handling
- API documentation: https://docs.kiriengine.app/

### Updating UI styling
- Use Tailwind CSS classes (no CSS modules needed)
- Maintain dark theme (bg-slate-950, text-white, etc.)
- Responsive grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4

## Known Limitations
- Local file storage (not production-ready for scale)
- PLY parser is simplified (may not handle all PLY variants)
- WebGL2 required for 3D rendering
- Processing time depends on KIRI Engine

## Future Enhancements
- S3 cloud storage integration
- Advanced 3D viewer with annotations
- Batch processing support
- Real-time processing preview
- Model comparison tools
- Sharing/collaboration features

## Troubleshooting

### Build errors
- Clear .next folder: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Check TypeScript: `npm run build`

### API not connecting
- Verify KIRI_API_KEY is set in .env.local
- Check network tab in browser DevTools
- Review API response in console

### 3D model won't load
- Verify PLY file format is correct
- Check browser WebGL2 support
- Inspect console for fetch errors

## Running the Project
```bash
# Development
npm run dev
# Then open http://localhost:3000

# Production build
npm run build
npm start
```

## Testing & Debugging
- Use browser DevTools for debugging
- Check console for component/API errors
- Use React DevTools for state inspection
- Network tab for API request debugging

## Deployment Notes
- Requires Node.js 18+
- Build: `npm run build`
- Start: `npm start`
- Set KIRI_API_KEY in production environment
- Consider S3 integration for file storage at scale
