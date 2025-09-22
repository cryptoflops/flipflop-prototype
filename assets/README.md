# Assets Directory

This directory contains all media assets for the FlipFlop prototype.

## Structure

- **images/** - PNG, JPG, GIF, and SVG files for visual elements
- **fonts/** - Custom web fonts (TTF, OTF, WOFF)
- **sounds/** - Audio files (MP3, WAV, OGG) for sound effects or music

## Usage in P5.js

Load assets in the `preload()` function:

```javascript
let myImage;
let mySound;
let myFont;

function preload() {
  myImage = loadImage('assets/images/example.png');
  mySound = loadSound('assets/sounds/example.mp3');
  myFont = loadFont('assets/fonts/example.ttf');
}
```

## Note

Keep file sizes optimized for web delivery. Consider using:
- JPEG for photos
- PNG for graphics with transparency
- SVG for scalable vector graphics
- MP3 or OGG for audio (compressed)
- WOFF/WOFF2 for web fonts