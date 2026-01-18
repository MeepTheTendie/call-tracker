# Lessons Learned

**⚠️ DEPRECATED:** See `/home/meep/MEGA_LEARNINGS.md` for the complete lessons database.

This file is kept for historical reference but is no longer updated.

---

## Quick Links

- [MEGA LEARNINGS](/home/meep/MEARNINGS.md) - All lessons combined
- [Call Tracker Specific](#call-tracker-specific)

---

## Call Tracker Specific

### Single HTML Files > Frameworks for Simple Utilities

**Problem:** Used React/Vite/TypeScript/Tauri for a simple call tracker.

**Solution:** Replaced with a single `index.html` file.

**Result:**
- No build step required
- Works offline
- Easy to share (just send the file)
- ~4600 lines of boilerplate deleted
- 22 files reduced to 3

### Windows Batch Launcher

Created `start.bat` for non-technical users:
- Double-click to run
- Simple choice menu for dev vs prod

### Pre-commit Hook Tuning

Secret scanner flagged keyboard shortcut comments as secrets:
```
- Hotkey: Win+Shift+C to log call
```

**Fix:** These were false positives. The pre-commit hook is too aggressive for general use.

### Clean Repos Are Better

Deleted files from call-tracker:
- All React/Vite/TypeScript scaffolding
- Tauri desktop app files
- Package configs
- Multiple tsconfig files

**Result:** Repo went from 24 files to 3 files.

---

## Key Takeaways

1. Start simple, add complexity only when needed
2. Vanilla HTML/JS works great for utility tools
3. Boilerplate accumulates fast - audit periodically
4. Delete what you don't need

## Files Affected

- `call-tracker/index.html` - standalone app
- `call-tracker/start.bat` - Windows launcher
