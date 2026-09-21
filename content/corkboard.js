// Layout of the 3D corkboard. Coordinates are in board units: x from -1.9 to 1.9 (left to
// right), y from -1.3 to 1.3 (bottom to top). `rot` is radians, `s` a size multiplier.
// Photos come from content/photos.js by filename; any photo whose file is missing is skipped.
export const photoSpots = [
  { file: 'ucsd.jpg',        x: -1.38, y:  0.62, rot: -0.07, s: 0.74 },
  { file: 'pc-build.jpg',    x: -0.62, y:  0.86, rot:  0.06, s: 0.46 },
  { file: 'hackathon.jpg',   x:  0.12, y:  0.66, rot: -0.05, s: 0.6 },
  { file: 'guitars.jpg',     x:  0.86, y:  0.88, rot:  0.09, s: 0.44 },
  { file: 'bestfriend.jpg',  x:  1.5,  y:  0.5,  rot: -0.08, s: 0.54 },
  { file: 'family.jpg',      x: -0.98, y: -0.08, rot: -0.05, s: 0.5 },
  { file: 'cat.jpg',         x: -0.32, y: -0.02, rot:  0.08, s: 0.44 },
  { file: 'coffee.jpg',      x:  1.6,  y: -0.3,  rot:  0.05, s: 0.42 }
];

// Album sleeves: drop cover images into assets/albums/ with these names. A slot whose file
// doesn't exist yet stays empty. Keep the lower right (x > 0.2, y < -0.55) clear: the room's
// lamp shade sits in front of it and would cut off a cover.
export const albumSpots = [
  { file: 'album-1.jpg', x: -0.6,  y:  0.36, rot: -0.1,  size: 0.3 },
  { file: 'album-2.jpg', x: -1.0,  y: -0.52, rot: -0.06, size: 0.34 },
  { file: 'album-3.jpg', x:  0.98, y:  0.3,  rot:  0.07, size: 0.32 },
  { file: 'album-4.jpg', x: -1.66, y: -0.04, rot: -0.09, size: 0.3 },
  { file: 'album-5.jpg', x: -1.42, y: -0.32, rot:  0.1,  size: 0.3 }
];

// The nyc postcard: a goal, pinned low on the board (clear of the lamp, lower right).
export const nycCard = { x: -0.62, y: -1.0, rot: -0.04, w: 0.72 };

// WebP stickers: drop files into assets/stickers/ with these names. A slot whose file
// doesn't exist yet is just empty. `w` is the sticker's width; height follows the image.
export const stickerSpots = [
  { file: 'sticker-1.webp', x: -1.78, y:  1.05, rot: -0.15, w: 0.34 }, // chrome star
  { file: 'sticker-2.webp', x: -0.98, y:  1.02, rot:  0.12, w: 0.3 },  // bratz
  { file: 'sticker-3.webp', x:  0.65, y: -0.32, rot: -0.12, w: 0.34 }, // apple
  { file: 'sticker-4.webp', x:  0.95, y: -0.34, rot:  0.1,  w: 0.32 }, // google
  { file: 'sticker-5.webp', x:  0.42, y:  0.08, rot:  0.07, w: 0.34 }, // statue of liberty
  { file: 'sticker-6.webp', x:  1.2,  y:  0.04, rot: -0.06, w: 0.38 }, // saturn
  { file: 'sticker-7.webp', x: -0.33, y:  0.36, rot:  0.1,  w: 0.32 },  // persian stamp
  { file: 'sticker-8.webp', x:  1.8,  y:  0.12, rot: -0.1,  w: 0.3 }   // red stamp
];

export const pinColors = [0xe9447f, 0x4fb8b0, 0xf2c14e, 0x8a6fd6, 0xf07f4a];

// Vines hang from the top edge of the frame. `len` is how far down they trail (board units);
// keep the middle ones short so they don't cover faces.
export const vineSpots = [
  { seed: 1, x: -1.98, len: 1.6 },
  { seed: 2, x: -0.22, len: 0.55 },
  { seed: 3, x:  0.62, len: 0.42 },
  { seed: 4, x:  1.1,  len: 0.8,  flip: true },
  { seed: 5, x:  1.5,  len: 0.6,  flip: false },
  { seed: 6, x:  1.98, len: 1.9,  flip: true }
];

// Photobooth strips: drop images into assets/photos/ (e.g. strip-1.jpg). `w` is the strip's
// width; height follows the image. A slot whose file doesn't exist yet stays empty.
export const stripSpots = [
  { file: 'strip-1.jpg', x: 0.12, y: -0.42, rot:  0.05, w: 0.3 }
];
