# 1776: The Road To Independence — Beta Build

Static build of the Declaration Game for beta testing.

## What this is

A Vite + React + TypeScript + Zustand game, compiled to plain static files. Hosted on
GitHub Pages, the game runs at `https://<your-username>.github.io/<repo-name>/`.

## Files

- `index.html` — entry document
- `assets/` — compiled JavaScript and CSS (plus a source map for debugging)

Asset paths are relative (`./assets/...`), so the build works from any sub-path without
reconfiguration.

## Notes for testers

- Progress is saved in the browser's local storage, per device and per browser. Clearing
  site data starts a new game. Use the "Restart Game" button in the top-right to reset.
- The game is currently desktop-first (a 1200px-wide layout with a tall map).

## Updating the hosted build

Rebuild the game and upload the new contents of this folder to the repository root.
GitHub Pages rebuilds automatically, usually within a minute.

## Credits

Olik Ahren
