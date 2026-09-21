# Shazi Portfolio Design

An interactive desktop-room portfolio for Shazi Bidarian. There's no nav bar —
everything in the 3D room is a page: click the CD rack for projects, the
corkboard for about-me, the desk papers for the resume, or the mail tray to
say hi. A "plain view" (top right, or automatic on portrait phones / when WebGL
is unavailable) shows the same content as a normal scrolling page.

## Structure

- `index.html` — page markup
- `styles/` — one stylesheet per concern: `base.css` (reset, variables,
  shared animations/buttons), `chrome.css` (floating badges over the
  room), `resume.css` (the resume overlay), `panel.css` (the side panel),
  `corkboard.css`, `quick.css` (plain view, toast, rotate gate)
- `content/` — plain data, edit this for copy changes:
  - `projects.js` — the 5 rack "discs". Each entry drives **both** the 3D
    case art and the case-study text in the panel, so adding/reordering a
    project is a single edit here. Optional per-project fields: `repo` (code
    link, `null` = private), `live` (demo link), `shot` (screenshot or animated
    WebP in `assets/projects/`).
  - `photos.js` — the corkboard photos (files in `assets/photos/`): captions,
    optional long popups; feeds the About panel grid
  - `corkboard.js` — where photos, album sleeves and PNG stickers (files in
    `assets/stickers/`, named `sticker-1.webp`…; album covers in `assets/albums/`)
    sit on the 3D board
  - `tracks.js` — the "now playing" track per project (30s Apple Music previews)
  - `hobbies.js` — the laptop screen's tabs (lists plus the "workspace" tab, which
    `room/screen.js` draws as a fake editor + Claude chat)
- `app.js` — state machine wiring the panel/overlay UI to the 3D room (plain
  JS module, no framework)
- `room/` — the `<cd-room-v2>` custom element (ES modules):
  - `cd-room-v2.js` — defines the element, wires `scene.js` + `controller.js`
    together
  - `scene.js` — builds the static scene (lights, furniture, the four zone
    props, cat, butterfly) from `content/projects.js`
  - `controller.js` — pointer/click handling, the animation loop, and the
    public API: `selectZone(zone, index)`, `backOne()`, `deselect()`,
    `setMode('day'|'night')`; dispatches `zoneselect` / `zonehover` /
    `catmeow` DOM events
  - `textures.js` — canvas-drawn textures for props (CD covers, resume
    sheet, polaroids, posters, window views, butterfly wings)
  - `audio.js` — the synthesized "meow"
- `vendor/three.min.js` — three r150, vendored so the room doesn't depend on a CDN
- `uploads/` — resume PDF served for download
- `assets/og-room.jpg` — the link-preview image (a render of the room)

Raw source photos/stickers/screenshots live in `assets/*/originals/` (git-ignored);
the site only uses the optimized copies one level up (JPEG ≤1280px, WebP stickers).

## Running locally

Static site, no build step — `app.js` and `room/*.js` are plain ES modules
loaded via `<script type="module">`, so any static file server works, e.g.:

```sh
npx serve .
```

Opening `index.html` directly via `file://` will not work (ES modules
require http/https), so always serve it.
