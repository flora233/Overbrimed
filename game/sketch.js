let scene = [
    'farm',
    'weave',
    'dye',
    'cut and sew',
    'transportation'
];
let currentScene = scene[0];
var infobox;

let world;
let popins_regular; //font
let truck;
let truckImage;
let cotton_ballImg;
let laborImg;
let sweatImg;
let boundaries = [];
let spring;

let cotton_farmImg;
let mapImg;
let dyeImg;

let cotton_balls = [];
let waterParticles = [];
let chemicalParticles = [];
let cotton_ballNum = 0;
var chemicalNum = 0;
var waterNum = 0;
var laborParticles = [];
var sweatParticles = [];

let water_sound;
let truck_sound;
let nextButton;

// the fabric variables
var cloth_particles_wide = 30;
var cloth_particles_tall = 20;
var cloth_width = 600;
var cloth_height = 450;
var stiffness = 0.1; 
var physics; 
var cloth_particles = []; 
var x_spacing = cloth_width/cloth_particles_wide;
var y_spacing = cloth_height/cloth_particles_tall;
var i0 = cloth_particles_wide-1;
var j0 = cloth_particles_tall-1;

//
var whiteParticles = [];
var pinkParticles = [];
var blueParticles = [];

function preload() {
    sweatImg = loadImage('../assets/water.png');
    laborImg = loadImage('../assets/labor.png');
    cotton_ballImg = loadImage('../assets/cotton_ball.png');
    truckImage = loadImage('../assets/truck.png');
    popins_regular = loadFont('../assets/Poppins/Poppins-Regular.ttf');

    cotton_farmImg = loadImage('../assets/cotton_farm.jpeg');
    mapImg = loadImage('../assets/map.png');
    flagImg = loadImage('../assets/flag.png');
    dyeImg = loadImage('../assets/dye.png');
}

function setup() {
    //set up the water sound
    //console.log(windowWidth, windowHeight);
    water_sound = loadSound('../assets/water_drop.wav');
    truck_sound = loadSound('../assets/truck.wav');
    if (getAudioContext().state !== 'running') {
        text('tap to play', width/2, 20);
    }
    
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas');
    w = windowWidth;
    h = windowHeight;
    world = createWorld();
    textFont(popins_regular);
    infobox = new Infobox(windowWidth - 50, windowHeight / 15);
    
    spring = new Spring();
    truck = new TruckObj(truckImage, w/10, h/5 * 4, 500, 320);

    document.getElementById('s-0').style.color = "Cyan"

    // window boundreis
    boundaries.push(new Boundary(width / 2, height - 5, width, 10, 0));
    boundaries.push(new Boundary(width / 2, 5, width, 10, 0));
    boundaries.push(new Boundary(width - 5, height / 2, 10, height, 0));
    boundaries.push(new Boundary(5, height / 2, 10, height, 0));

    // ******* this is a crazy long part of the cloth set up ********* \\
    physics=new VerletPhysics2D();
    physics.addBehavior(new GravityBehavior(new Vec2D(0,0.5)));
    physics.setWorldBounds(new Rect(0,0,windowWidth,windowHeight));
    // Go through each column of the cloth..
    for(var i = 0; i<cloth_particles_wide; i++){
      // this is how we create a 2D array
      cloth_particles[i] = []; 
      // Go through each row of the cloth..
      for(var j = 0; j<cloth_particles_tall; j++){
        // This is where we create the particles
        cloth_particles[i][j] = new ClothParticle(new Vec2D(width/2-cloth_width/2+i*x_spacing,j*y_spacing));
        // And add the particle to the physics workd
        physics.addParticle(cloth_particles[i][j]);
      }
    }
    // Go through each column of the cloth..
    for(var i = 0; i<cloth_particles_wide; i++){
      // Go through each row of the cloth..
      for(var j = 0; j<cloth_particles_tall; j++){
        if(i>0 && j==0){
          // then make a spring connecting this particle (i,j) to the particle to its left (i-1,j)
          physics.addSpring(new VerletSpring2D(cloth_particles[i][j],cloth_particles[i-1][j],x_spacing,stiffness));
        }
        if((i==0 || i==i0) && j>0){
          // also make a spring connecting this particle (i,j) to the particle above it (i,j-1)
          physics.addSpring(new VerletSpring2D(cloth_particles[i][j],cloth_particles[i][j-1],y_spacing,stiffness));
        }
        if(i>0 && j>0 && i<i0 && j<j0){
          physics.addSpring(new VerletSpring2D(cloth_particles[i][j],cloth_particles[i-1][j-1],1.4*y_spacing,stiffness));
          physics.addSpring(new VerletSpring2D(cloth_particles[i][j],cloth_particles[i+1][j-1],1.4*y_spacing,stiffness));
        }

      }
    }
    // Lock corners in place
    cloth_particles[0][0].lock();
    //cloth_particles[cloth_particles_wide /2][0].lock();
    cloth_particles[cloth_particles_wide-1][0].lock();
    /******************/
}

function draw() {
  imageMode(CENTER);
  let timeStep = 1.0 / 30;
  world.Step(timeStep, 10, 10)

  // scene selectors
  if (currentScene == scene[0]) {
      background(255);

      textSize(48);
      fill(255, 235, 205);
      noStroke();
      text('Cotton needs water & chemicals to grow', 50, 250);

      textSize(64);
      noStroke();
      fill(150);
      text('Add 2700 Liters of water', 50, 320);
      text('and 100 Liters of liquid chemicals', 50, 380);

      infobox.display();
      infobox.water_input = waterParticles.length * 4;
      infobox.chemical_input = chemicalParticles.length * 0.002;
      infobox.energy_input = 0.2;
      infobox.product_amount = 0;

      spring.update(mouseX, mouseY);
      spring.display();
      truck.display();

      noStroke();
      nextButton = createButton('Next');
      nextButton.position(w -230, 650);
      nextButton.id('next-button');
      nextButton.style('border', '1px solid black');
      nextButton.style('background-color', 'transparent');
      nextButton.style('font-size', '24px');
      nextButton.style('cursor', 'pointer');
      nextButton.mouseReleased(switchScene);
      function switchScene() {
        currentScene = scene[1];
      }

      // add cotton particles
      if (random(1) < 0.5 && cotton_ballNum < 1000) {
        let sz = random(50, 80);
        cotton_balls.push(new CottonParticle(cotton_ballImg, width / 2, 200, sz));
        cotton_ballNum += 50;
      }
      for (let i = cotton_balls.length - 1; i >= 0; i--) {
        cotton_balls[i].display();
        if (cotton_balls[i].done()) {
            cotton_balls.splice(i, 1);
        }
      }

      // waterParticles 
      if (random(1) < 0.5 && waterParticles.length < 78 ) {
          let sz = random(20, 30);
          waterParticles.push(new WaterParticle(width / 3, 10, sz));
          waterNum +=10;
      }
      for (let i = waterParticles.length - 1; i >= 0; i--) {
        waterParticles[i].display();
        if (waterParticles[i].done()) {
            waterParticles.splice(i, 1);
        }
      }

      // chenimcal particles
      if (random(1) < 0.5 && chemicalParticles.length < 50) {
        let sz = random(5, 10);
        chemicalParticles.push(new ChemicalParticle(width / 3 * 2, 10, sz));
        chemicalNum +=10;
      }

    for (let i = chemicalParticles.length - 1; i >= 0; i--) {
      chemicalParticles[i].display();
      if (chemicalParticles[i].done()) {
          chemicalParticles.splice(i, 1);
      }
    }

      //boundtries
      for (let i = 0; i < boundaries.length; i++) {
        boundaries[i].display();
      }
    
      // _____________the second scene______________ \\
  } else if (currentScene == scene[1]) {
      clear();
      background(250);
      spring.update(mouseX, mouseY);
      spring.display();

      document.getElementById('s-0').style.color = "LightGray"
      document.getElementById('s-1').style.color = "cyan"

      textSize(48);
      fill(255, 235, 205);
      noStroke();
      text('Then the cotton balls are yarned and weaved', 50, 350);

      textSize(64);
      noStroke();
      fill(150);
      text('This process requires water and energy', 50, 420);
      //text('a piece of fabric', 50, 380);
      infobox.display();
      infobox.water_input = waterParticles.length * 4;
      infobox.chemical_input = chemicalParticles.length * 0.002;
      infobox.energy_input = 0.6;
      infobox.product_amount = 0;

      nextButton.mouseReleased(switchScene);
      function switchScene() {
        currentScene = scene[2];
      }

        // water display
      if (random(1) < 0.5 && waterParticles.length < 105 ) {
        let sz = random(20, 30);
        waterParticles.push(new WaterParticle(width / 2, 10, sz));
        waterNum +=10;
      }
      for (let i = waterParticles.length - 1; i >= 0; i--) {
        waterParticles[i].display();
        if (waterParticles[i].done()) {
            waterParticles.splice(i, 1);
        }
      }
      //kill the cotton ball
      for (let i = cotton_balls.length - 1; i >= 0; i--) {
        cotton_balls[i].killBody();
      }

      // chemicals display
      for (let i = chemicalParticles.length - 1; i >= 0; i--) {
          chemicalParticles[i].display();
          if (chemicalParticles[i].done()) {
              chemicalParticles.splice(i, 1);
          }
      }

      // cotton ball
      // for (let i = cotton_balls.length - 1; i >= 0; i--) {
      //   cotton_balls[i].display();
      //   if (cotton_balls[i].done()) {
      //       cotton_balls.splice(i, 1);
      //   }
      // }

      // ******************  the cloth  ***************\\

    // here starts the draw, Again, we iterate through all the particles (columns and rows)
    physics.update();
    stroke(100);
    for(var i = 0; i<cloth_particles_wide; i++){
      for(var j = 0; j<cloth_particles_tall; j++){
        if(i>0 && j==0){
          // then make a spring connecting this particle (i,j) to the particle to its left (i-1,j)
          line(cloth_particles[i][j].x,cloth_particles[i][j].y,cloth_particles[i-1][j].x,cloth_particles[i-1][j].y);
        }
        if((i==0 || i==i0) && j>0){
          // also make a spring connecting this particle (i,j) to the particle above it (i,j-1)
          line(cloth_particles[i][j].x,cloth_particles[i][j].y,cloth_particles[i][j-1].x,cloth_particles[i][j-1].y);
        }
        if(i>0 && j>0 && i<i0 && j<j0){
          line(cloth_particles[i][j].x,cloth_particles[i][j].y,cloth_particles[i-1][j-1].x,cloth_particles[i-1][j-1].y);
          line(cloth_particles[i][j].x,cloth_particles[i][j].y,cloth_particles[i+1][j-1].x,cloth_particles[i+1][j-1].y);
        }
      }
    }
    if (mouseIsPressed) {
      for(var i = 0; i<cloth_particles_wide; i++){
        for(var j = 0; j<cloth_particles_tall; j++){
          if(abs(cloth_particles[i][j].x-mouseX)<x_spacing && abs(cloth_particles[i][j].y-mouseY)<y_spacing){
            i0 = i;
            j0 = j;
          }
        }
      }
      // Set this particle's position to be the mouse position
      cloth_particles[i0][j0].lock(); 
      cloth_particles[i0][j0].x = mouseX;
      cloth_particles[i0][j0].y = mouseY;
      cloth_particles[i0][j0].unlock(); 

    }
 /**********************************/
  //boundtries display
  for (let i = 0; i < boundaries.length; i++) {
    boundaries[i].display();
  }

  /*_________________ the third scene______________ */
  } else if (currentScene == scene[2]) {
    clear();
    background(250);
    spring.update(mouseX, mouseY);
    spring.display();
    infobox.display();
    infobox.water_input = waterParticles.length * 4;
    infobox.chemical_input = (whiteParticles.length + pinkParticles.length + blueParticles.length) * 0.1 + 0.1;
    infobox.energy_input = 0.9;
    infobox.product_amount = 0;

    document.getElementById('s-1').style.color = "LightGray"
    document.getElementById('s-2').style.color = "cyan"

    textSize(48);
    fill(100, 200, 255);
    noStroke();
    text('The dyeing process requires', 450, 250);

    image(dyeImg, 250, 300, 200, 200);

    textSize(64);
    noStroke();
    fill(150);
    text('Tons of water and generates', 450, 320);
    text('carcinogenic waste ', 450, 390);
    //text('a piece of fabric', 50, 380);

    nextButton.mouseReleased(switchScene);
    function switchScene() {
      currentScene = scene[3];
    }

    // create container and different color dying
      //bleach
    if (whiteParticles.length < 50) {
      let sz = random(6, 8);
      whiteParticles.push(new ColorParticle(color(150), 250, 550, sz));
    }
    for (let i = 0; i < whiteParticles.length; i++) {
      whiteParticles[i].display();
      if (whiteParticles[i].done()) {
        whiteParticles.splice(i, 1);
      }
    }
    stroke(0)
    fill(255);
    push();
    translate(250, 600);
    quad(-80, -100, 80, -100, 50, 100, -50, 100);
    textSize(24);
    fill(0);
    text('bleach', -40, 0)
    pop();

      //pink
    if (pinkParticles.length < 50) {
      let sz = random(5, 7);
      pinkParticles.push(new ColorParticle(color(255,84,167), 550, 550, sz));
    }
    for (let i = 0; i < pinkParticles.length; i++) {
      pinkParticles[i].display();
      if (pinkParticles[i].done()) {
        pinkParticles.splice(i, 1);
      }
    }
    stroke(255,84,167);
    push();
    translate(550, 600);
    quad(-80, -100, 80, -100, 50, 100, -50, 100);
    textSize(24);
    fill(0);
    text('dye pink', -50, 0)
    pop();

    //blue
    if (blueParticles.length < 50) {
      let sz = random(6, 8);
      blueParticles.push(new ColorParticle(color(0,255,255), 750, 550, sz));
    }
    for (let i = 0; i < blueParticles.length; i++) {
      blueParticles[i].display();
      if (blueParticles[i].done()) {
        blueParticles.splice(i, 1);
      }
    }
    stroke(0,255,255);
    push();
    translate(750, 600);
    quad(-80, -100, 80, -100, 50, 100, -50, 100);
    textSize(24);
    fill(0);
    text('dye blue', -50, 0)
    pop();


    // water display
    if (random(1) < 0.5 && waterParticles.length < 174 ) {
      let sz = random(20, 30);
      waterParticles.push(new WaterParticle(width / 2, 10, sz));
      waterNum +=10;
    }
    for (let i = waterParticles.length - 1; i >= 0; i--) {
      waterParticles[i].display();
      if (waterParticles[i].done()) {
          waterParticles.splice(i, 1);
      }
    }

    // chemicals display
    for (let i = chemicalParticles.length - 1; i >= 0; i--) {
        chemicalParticles[i].display();
        if (chemicalParticles[i].done()) {
            chemicalParticles.splice(i, 1);
        }
    }

    //boundtries display
    for (let i = 0; i < boundaries.length; i++) {
      boundaries[i].display();
    }
  /*_________________ the forth scene______________ */
  } else if (currentScene == scene[3]) {
    clear();
    background(250);
    spring.update(mouseX, mouseY);
    spring.display();
    infobox.display();
    infobox.water_input = waterParticles.length * 4;
    //infobox.chemical_input = (whiteParticles.length + pinkParticles.length + blueParticles.length) * 0.1 + 0.1;
    infobox.energy_input = 1.1;
    infobox.product_amount = laborParticles.length * 0.05;

    document.getElementById('s-2').style.color = "LightGray"
    document.getElementById('s-3').style.color = "cyan"

    textSize(48);
    fill(150);
    noStroke();
    text('Labors cut and sew in the factory', 50, 250);

    textSize(64);
    noStroke();
    fill(150);
    text('Most of them are in poor condition', 50, 320);
    //text('carcinogenic waste ', 50, 390);
    //text('a piece of fabric', 50, 380);

    nextButton.mouseReleased(switchScene);
    function switchScene() {
      currentScene = scene[4];
    }

    // water display
    for (let i = waterParticles.length - 1; i >= 0; i--) {
      waterParticles[i].display();
      if (waterParticles[i].done()) {
          waterParticles.splice(i, 1);
      }
    }

    // chemicals display
    for (let i = chemicalParticles.length - 1; i >= 0; i--) {
        chemicalParticles[i].display();
        if (chemicalParticles[i].done()) {
            chemicalParticles.splice(i, 1);
        }
    }

    //blue dye
    for (let i = 0; i < blueParticles.length; i++) {
      blueParticles[i].display();
      if (blueParticles[i].done()) {
        blueParticles.splice(i, 1);
      }
    }
    //pink dye
    for (let i = 0; i < pinkParticles.length; i++) {
      pinkParticles[i].display();
      if (pinkParticles[i].done()) {
        pinkParticles.splice(i, 1);
      }
    }
    // bleach dye
    for (let i = 0; i < whiteParticles.length; i++) {
      whiteParticles[i].display();
      if (whiteParticles[i].done()) {
        whiteParticles.splice(i, 1);
      }
    }

    //boundtries display
    for (let i = 0; i < boundaries.length; i++) {
      boundaries[i].display();
    }

    // the labor particles
    if (laborParticles.length < 20) {
      let sz = random(30, 50);
      laborParticles.push(new LaborParticle(laborImg, width / 2, 200, sz));
    }
    for (let i = laborParticles.length - 1; i >= 0; i--) {
      laborParticles[i].display();
      if (laborParticles[i].done()) {
          laborParticles.splice(i, 1);
      }
    }
    // the sweat particles
    if (sweatParticles.length < 20) {
      let sz = random(30, 50);
      sweatParticles.push(new LaborParticle(sweatImg, width / 2, 200, sz));
    }
    for (let i = sweatParticles.length - 1; i >= 0; i--) {
      sweatParticles[i].display();
      if (sweatParticles[i].done()) {
          sweatParticles.splice(i, 1);
      }
    }    


    
  } 
  
  /*_________________ the fifth scene______________ */
  else if (currentScene == scene[4]) {
    clear();
    background(255);
    spring.update(mouseX, mouseY);
    spring.display();
    infobox.display();
    infobox.water_input = waterParticles.length * 4;
    //infobox.chemical_input = (whiteParticles.length + pinkParticles.length + blueParticles.length) * 0.1 + 0.1;
    infobox.energy_input = 1.6;
    infobox.product_amount = laborParticles.length * 0.05;

    document.getElementById('s-3').style.color = "LightGray"
    document.getElementById('s-4').style.color = "cyan"

    image(mapImg, windowWidth / 2, windowHeight / 2, width, height);
    image(flagImg, windowWidth / 4 * 3, windowHeight / 2 -150, 80, 80);
    noStroke();
    fill(255, 0, 0, 100);
    ellipse(windowWidth / 5 + 80, windowHeight / 2 - 50, 25); //united states
    ellipse(windowWidth / 5 - 100, windowHeight / 2 - 50, 15); 
    ellipse(windowWidth / 5 + 90, windowHeight / 2 - 20, 10); 
    ellipse(windowWidth / 5 + 120, windowHeight / 2 - 100, 25); 
    ellipse(windowWidth / 2, windowHeight / 2 - 80, 20); // euarope
    ellipse(windowWidth / 2 - 20, windowHeight / 2 - 70, 15);
    ellipse(windowWidth / 4 * 3 - 20, windowHeight / 2 -120, 30);

    strokeWeight(3);
    textSize(48);
    fill(255);
    stroke(0);
    text('Finally, trucks, trains and cargos', 350, 450);

    textSize(64);
    fill(255);
    stroke(0);
    text('Ship them to high-income countries', 150, 520);
    //text('carcinogenic waste ', 50, 390);
    //text('a piece of fabric', 50, 380);
    strokeWeight(1);

    nextButton.mouseReleased(switchScene);
    function switchScene() {
      location = "../reference/step1.html"
    }

    // water display
    for (let i = waterParticles.length - 1; i >= 0; i--) {
      waterParticles[i].display();
      if (waterParticles[i].done()) {
          waterParticles.splice(i, 1);
      }
    }

    // chemicals display
    for (let i = chemicalParticles.length - 1; i >= 0; i--) {
        chemicalParticles[i].display();
        if (chemicalParticles[i].done()) {
            chemicalParticles.splice(i, 1);
        }
    }

    //blue dye
    for (let i = 0; i < blueParticles.length; i++) {
      blueParticles[i].display();
      if (blueParticles[i].done()) {
        blueParticles.splice(i, 1);
      }
    }
    //pink dye
    for (let i = 0; i < pinkParticles.length; i++) {
      pinkParticles[i].display();
      if (pinkParticles[i].done()) {
        pinkParticles.splice(i, 1);
      }
    }
    // bleach dye
    for (let i = 0; i < whiteParticles.length; i++) {
      whiteParticles[i].display();
      if (whiteParticles[i].done()) {
        whiteParticles.splice(i, 1);
      }
    }

    //boundtries display
    for (let i = 0; i < boundaries.length; i++) {
      boundaries[i].display();
    }

    // the labor particles
    for (let i = laborParticles.length - 1; i >= 0; i--) {
      laborParticles[i].display();
      if (laborParticles[i].done()) {
          laborParticles.splice(i, 1);
      }
    }
    // the sweat particles
    for (let i = sweatParticles.length - 1; i >= 0; i--) {
      sweatParticles[i].display();
      if (sweatParticles[i].done()) {
          sweatParticles.splice(i, 1);
      }
    }    
    

  }

}





/* _____________user interactions____________ */
function mouseReleased() {
    spring.destroy();
  }
  
  // When the mouse is pressed we. . .
  function mousePressed() {
    // Check to see if the mouse was clicked on the box
    // water mouse interaction
    for (let i = waterParticles.length - 1; i >= 0; i--) {
      if (waterParticles[i].contains(mouseX, mouseY)) {
        // And if so, bind the mouse position to the box with a spring
        spring.bind(mouseX, mouseY, waterParticles[i]);
      }
    }
    // pesticides mouse interaction
    for (let i = chemicalParticles.length - 1; i >= 0; i--) {
        if (chemicalParticles[i].contains(mouseX, mouseY)) {
          // And if so, bind the mouse position to the box with a spring
          spring.bind(mouseX, mouseY, chemicalParticles[i]);
        }
    }

    // sweat and labor particles
    for (let i = laborParticles.length - 1; i >= 0; i--) {
      if (laborParticles[i].contains(mouseX, mouseY)) {
        // And if so, bind the mouse position to the box with a spring
        spring.bind(mouseX, mouseY, laborParticles[i]);
      }
      if (sweatParticles[i].contains(mouseX, mouseY)) {
        // And if so, bind the mouse position to the box with a spring
        spring.bind(mouseX, mouseY, sweatParticles[i]);
      }
    }
    
  }

  // to do list
  /* 
   -function add pesticides
   -create pesticides particles
   -create container to hold particles
  
   -add cutton ball to the first scene
   -add next scene button to the farm scene
   -add more elements to the farm scene

   -initiate the dyeing scene
   -create function for it
   create illustration for weaving machine


  -home page, done, add more facts on it,
   -farm, done,
  -weave, just push it back to the last step,
  -dye, put colorful fabric on the top,
  -sew and cut, create drag and drop people in the can,
  -transportation.

  -add the navigation simply,
  -create a data summary page to show the total cost,
  -create the reference page

  */