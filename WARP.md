# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

flipflop-prototype is a creative coding project built with P5.js. The project is currently in initial setup phase.

## Project Setup

Since this is a P5.js project, use the following structure:

### Initial Setup Commands
```bash
# Create basic project structure
mkdir -p assets lib
touch index.html sketch.js style.css

# Open project in browser for local development
open index.html
```

### Basic File Templates

When creating the initial files, use these templates:

**index.html**:
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
  <link rel="stylesheet" type="text/css" href="style.css">
  <meta charset="utf-8" />
  <title>FlipFlop Prototype</title>
</head>
<body>
  <script src="sketch.js"></script>
</body>
</html>
```

**sketch.js** (basic template):
```javascript
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
```

## Project Structure

```
flipflop-prototype/
├── index.html       # Main HTML file with P5.js CDN links
├── sketch.js        # Primary P5.js sketch file
├── style.css        # Custom CSS styling
├── assets/          # Images, fonts, sounds, and other media
│   ├── images/
│   ├── fonts/
│   └── sounds/
└── lib/            # Additional JavaScript libraries if needed
```

## Development Commands

```bash
# Run local development (macOS)
open index.html

# Or use a simple HTTP server if needed for CORS
python3 -m http.server 8000
# Then navigate to http://localhost:8000

# Version control
git add .
git commit -m "Your commit message"
git push origin main
```

## P5.js Development Patterns

### Essential Functions
- `setup()` - Called once at start, initialize canvas and variables here
- `draw()` - Called continuously (60fps default), main animation loop
- `preload()` - Called before setup(), load assets here

### Common P5.js Patterns
```javascript
// Loading images
let img;
function preload() {
  img = loadImage('assets/images/example.png');
}

// Responsive canvas
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Mouse interaction
function mousePressed() {
  // Handle mouse click
}

// Keyboard interaction
function keyPressed() {
  // Handle key press
}
```

## Debugging

- Use browser Developer Console (Cmd+Option+I on Mac)
- Add `console.log()` statements for debugging
- P5.js errors appear in the browser console
- Use `noLoop()` to pause the draw loop for debugging
- Use `frameRate(1)` to slow down animations for observation

## Repository Information

- **GitHub Repository**: https://github.com/cryptoflops/flipflop-prototype
- **Main Branch**: main
- **Initial Commit**: Basic README only

## User Preferences

- P5.js is the preferred creative coding framework
- Focus on clean, readable code structure
- Keep the global mode for simplicity unless instance mode is specifically needed