# Call Tracker - Development Context

## Project Overview

Simple Windows desktop app for tracking call center calls with:

- "+1" button to log completed calls
- Timer showing time since last call
- Daily call count

## Tech Stack

- Frontend: React 19 + Vite + TypeScript + Tailwind CSS 4
- Desktop: Tauri 2 (Rust backend)
- Storage: localStorage

## Features

- System tray icon
- Hotkey: Win+Shift+C to log call
- Daily reset at midnight
- Transparent window, always on top
- Runs in small fixed window (320x480)

## Commands

```bash
# Development
npm run dev

# Build for Windows
npm run tauri build

# Run in development mode
npm run tauri dev
```

## Deployment

Vercel auto-deploys on push to main branch. No GitHub Actions needed.

**PERMANENT RULE: NO GitHub Actions - use Vercel auto-deploy only**

## Storage

Calls stored in localStorage with structure:

```typescript
interface CallLog {
  timestamp: number;
}
```

## Platform Notes

- Built for Windows (uses Windows-specific features)
- Uses Tauri 2 with custom protocol
- Transparent window with decorations disabled
- Always on top, skips taskbar

## Preferences

- **Auto-commit**: Enabled with smart commit messages
- **Push**: Auto-push after each session
