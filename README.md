# Shazi Portfolio Design

An interactive desktop-room portfolio for Shazi Bidarian. There's no nav bar —
everything in the 3D room is a page: click the CD rack for projects, the
corkboard for about-me, the desk papers for the resume, or the mail tray to
say hi.

## Structure

- `index.html` — page markup
- `styles.css` — all styling
- `app.js` — state machine wiring the UI to the 3D room (plain JS, no framework)
- `cd-room-v2.js` — the `<cd-room-v2>` custom element: the Three.js room scene
  (rack, corkboard, desk, mail tray, cat, day/night, butterfly). Emits
  `zoneselect` / `zonehover` / `catmeow` DOM events and exposes
  `selectZone(zone, index)`, `backOne()`, `deselect()`, `setMode('day'|'night')`.
- `uploads/` — resume PDF served for download

## Running locally

Static site, no build step. Serve the folder with anything that serves plain
files, e.g.:

```sh
npx serve .
```
