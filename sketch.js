// FlipFlop Prototype - Main Sketch
// A P5.js creative coding project

function setup() {
  // Create a full-window canvas
  createCanvas(windowWidth, windowHeight);
  
  // Set initial drawing settings
  background(220);
  strokeWeight(2);
}

function draw() {
  // Main animation loop
  // Simple example: draw circles that follow the mouse
  
  // Fade effect
  background(220, 220, 220, 10);
  
  // Draw a circle at mouse position
  fill(100, 150, 255, 100);
  noStroke();
  circle(mouseX, mouseY, 50);
  
  // Draw a smaller trailing circle
  fill(255, 100, 150, 100);
  circle(pmouseX, pmouseY, 30);
}

function windowResized() {
  // Handle window resizing to keep canvas full-screen
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  // Clear the canvas on mouse click
  background(220);
}

function keyPressed() {
  // Press 's' to save a screenshot
  if (key === 's' || key === 'S') {
    saveCanvas('flipflop-screenshot', 'png');
  }
  
  // Press 'c' to clear the canvas
  if (key === 'c' || key === 'C') {
    background(220);
  }
}