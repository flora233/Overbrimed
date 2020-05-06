// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com


// A reference to our box2d world
let world;

// A list we'll use to track fixed objects
let shirtImg;
var originalImg;

let boundaries = [];
let particles = [];
let spring;

function preload() {
  originalImg = createImg("../assets/original.gif");
  shirtImg = loadImage('../assets/shirt.png');
}


function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas');
  world = createWorld();

  spring = new Spring();
  boundaries.push(new Boundary(width / 2, height - 10, width, 20, 0));
  boundaries.push(new Boundary(width / 2, 10, width, 20, 0));
  boundaries.push(new Boundary(width - 10, height / 2, 20, height, 0));
  boundaries.push(new Boundary(10, height / 2, 20, height, 0));
}

function draw() {
  background(255);
  let timeStep = 1.0 / 10;
  world.Step(timeStep, 10, 10);

  originalImg.position(0, 150);
  
  spring.update(mouseX, mouseY);
  spring.display();

    // particles fall from the top every so often
  if (random(1) < 0.1) {
    let sz = random(50, 80);
    particles.push(new Particle(shirtImg, width / 4 * 3, 20, sz));
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].display();
    if (particles[i].done()) {
      particles.splice(i, 1);
    }
  }
    //boundtries
  for (let i = 0; i < boundaries.length ; i++) {
    boundaries[i].display();
  }

}



/* _____________user interactions____________ */
function mouseReleased() {
  spring.destroy();
}

// When the mouse is pressed we. . .
function mousePressed() {
  // Check to see if the mouse was clicked on the box
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].contains(mouseX, mouseY)) {
      // And if so, bind the mouse position to the box with a spring
      spring.bind(mouseX, mouseY, particles[i]);
    }
  }
}

