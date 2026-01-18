# Call Tracker

A simple Windows desktop app for tracking call center calls.

## Features

- **+1 Call button** - Log completed calls with a single click
- **Live timer** - Shows time since your last call
- **Daily count** - Tracks calls for the current day
- **Auto-reset** - Automatically clears old calls at midnight
- **Keyboard shortcut** - Press `Win+Shift+C` (or `Ctrl+Shift+C`) to log a call
- **Always on top** - Stays visible while you work
- **Compact design** - Small fixed window (320x480)

## Tech Stack

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS 4
- **Desktop**: Tauri 2 (Rust)
- **Storage**: localStorage

## Commands

```bash
# Development
npm run dev

# Build for Windows
npm run tauri build

# Run in development mode
npm run tauri dev
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Win+Shift+C` | Log a call |
| `Ctrl+Shift+C` | Log a call (alternative) |

## Project Structure

```
call-tracker/
├── src/              # React frontend
│   └── App.tsx       # Main application component
├── src-tauri/        # Tauri desktop backend
│   └── main.rs       # Rust entry point
└── dist/             # Production build output
```

## License

MIT
