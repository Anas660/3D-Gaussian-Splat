# Fields Dashboard - 3D Gaussian Splats Processor

A modern web application for uploading video/images and processing them into interactive 3D Gaussian Splats using the KIRI Engine API. Built with Next.js, React, and Three.js.

## Features

✨ **Dashboard Gallery**

- Clean, dark-themed responsive grid layout
- Real-time status tracking (Processing/Finished/Failed)
- Search and filter captures by name
- Hover metadata display with timestamps

🎬 **Upload Workflow**

- Drag & drop interface for video/image files
- Support for MP4, MOV, AVI, WebM, JPG, PNG (up to 5GB)
- Real-time progress tracking during upload and processing

🎨 **Interactive 3D Viewer**

- Orbit controls (rotate, zoom, pan) powered by Three.js
- Gaussian Splat rendering using antimatter15/splat library
- Download processed .ply files
- Responsive canvas that scales with window

🔄 **KIRI Engine Integration**

- Automatic task creation and status polling
- Progress tracking from upload to completion
- Error handling and retry logic

## Tech Stack

- **Frontend**: Next.js 14+ (App Router) + TypeScript
- **UI Framework**: React with Tailwind CSS
- **State Management**: Zustand
- **3D Rendering**: Three.js + splat viewer
- **API Client**: Axios
- **File Upload**: react-dropzone
- **Styling**: Tailwind CSS (dark theme)

## Prerequisites

- Node.js 18+
- npm or yarn
- KIRI Engine API key (get one at https://www.kiriengine.app/)

## Installation

1. Clone the repository:

```bash
git clone <your-repo>
cd 3dproject
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.local.example .env.local
```

4. Add your KIRI API key to `.env.local`:

```env
KIRI_API_KEY=your_actual_api_key_here
```

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── api/                    # Next.js API routes
│   │   ├── upload/            # File upload endpoint
│   │   └── kiri/
│   │       └── task/          # KIRI task creation & status
│   ├── viewer/
│   │   └── [id]/              # 3D viewer page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Dashboard home
│   └── globals.css            # Global styles
├── components/
│   ├── Dashboard.tsx          # Main dashboard view
│   ├── CaptureGrid.tsx        # Gallery grid component
│   ├── CreateModal.tsx        # Upload modal
│   └── Viewer.tsx             # 3D viewer component
└── lib/
    ├── store.ts               # Zustand state management
    └── kiri-api.ts            # KIRI API utilities
public/
├── uploads/                    # Uploaded file storage
└── models/                     # Processed model output
```

## API Routes

### POST /api/upload

Uploads a file to the server.

**Request:**

- Body: FormData with `file` field

**Response:**

```json
{
  "filePath": "/uploads/timestamp-filename.ext",
  "fileName": "timestamp-filename.ext",
  "success": true
}
```

### POST /api/kiri/task/create

Creates a 3D Gaussian Splat processing task in KIRI Engine.

**Request:**

```json
{
  "fileUrl": "https://example.com/path/to/file",
  "fileName": "video.mp4"
}
```

**Response:**

```json
{
  "taskId": "task-id-from-kiri",
  "status": "queued",
  "success": true
}
```

### GET /api/kiri/task/status?taskId=task-id

Polls the status of a processing task.

**Response:**

```json
{
  "id": "task-id",
  "status": "processing|completed|failed",
  "progress": 45,
  "output": {
    "ply": "https://kiri-bucket.s3.../output.ply",
    "glb": "https://kiri-bucket.s3.../output.glb"
  },
  "error": null
}
```

## Usage

### Processing a Capture

1. Click the **"Create"** button in the top-right corner
2. Drag and drop a video/image file or click to select
3. Monitor progress in the modal (shows real-time updates)
4. Once processed, click on the capture card to view the 3D model

### Viewing a 3D Gaussian Splat

1. Click on any "Finished" capture card from the dashboard
2. Use mouse controls to interact:
   - **Left-click + Drag**: Rotate
   - **Scroll**: Zoom in/out
   - **Middle-click + Drag**: Pan
3. Click **"Download PLY"** to export the model file

## Configuration

### KIRI Engine API

The application uses the KIRI Engine API for 3D Gaussian Splat processing. Endpoints and configuration:

- **Base URL**: `https://api.kiriengine.app/api/`
- **Authentication**: Via `x-api-key` header
- **Task Type**: `3d-gaussian-splat-scan`
- **Output Formats**: PLY, GLB

For detailed API documentation, visit: https://docs.kiriengine.app/

### Environment Variables

| Variable                    | Description              | Required                    |
| --------------------------- | ------------------------ | --------------------------- |
| `KIRI_API_KEY`              | Your KIRI Engine API key | Yes                         |
| `NEXT_PUBLIC_KIRI_API_BASE` | KIRI API base URL        | No (defaults to production) |

## Storage

Currently, the application uses:

- **Uploads**: Local filesystem (`public/uploads/`)
- **Models**: Cached from KIRI API output URLs

For production, consider integrating:

- AWS S3 for uploads and model storage
- Firebase Storage
- Cloudinary for media management

## Building for Production

```bash
npm run build
npm start
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers (WebGL2 required)

## Known Limitations

- Local file uploads are stored in `public/uploads/` (not suitable for production at scale)
- 3D viewer requires WebGL2 support
- Large files (>5GB) may take extended time to process
- Model output depends on KIRI Engine API response times

## Future Enhancements

- [ ] S3/Cloud storage integration
- [ ] Batch processing support
- [ ] Real-time model preview during processing
- [ ] Advanced 3D viewer with annotations
- [ ] Model comparison tools
- [ ] Sharing/collaboration features
- [ ] Processing history and analytics

## Troubleshooting

### "KIRI API key not configured"

- Ensure `KIRI_API_KEY` is set in `.env.local`
- Restart the dev server after adding the key

### "Failed to load 3D model"

- Verify the model file exists at the provided URL
- Check browser console for WebGL errors
- Ensure your browser supports WebGL2

### Upload fails with 413 error

- Increase Next.js body size limit in `next.config.js`
- Default is 1MB; adjust if needed for larger files

### Processing takes too long

- KIRI Engine processing time depends on file size and quality settings
- Check task status in the dashboard (hover over the capture)
- Maximum polling time is set to 30 minutes

## Contributing

Pull requests welcome! Please ensure:

- Code follows the project structure
- Tailwind CSS for styling
- TypeScript for type safety
- Components are reusable and well-documented

## License

MIT License - feel free to use this project as a template

## Support

For issues or questions:

1. Check the KIRI Engine API documentation: https://docs.kiriengine.app/
2. Review Next.js documentation: https://nextjs.org/docs
3. Consult the splat viewer library: https://github.com/antimatter15/splat

---

**Built with ❤️ for 3D Gaussian Splat enthusiasts**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
