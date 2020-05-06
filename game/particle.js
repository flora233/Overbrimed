// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// A rectangular box


// Constructor
class WaterParticle {
    constructor(x, y, r) {
      this.r = r;
  
      // Define a body
      let bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position = scaleToWorld(x, y);
  
      // Define a fixture
      let fd = new box2d.b2FixtureDef();
      // Fixture holds shape
      fd.shape = new box2d.b2PolygonShape();
      fd.shape.SetAsBox(scaleToWorld(this.r / 2), scaleToWorld(this.r / 2));
  
      // Some physics
      fd.density = 0;
      fd.friction = 0;
      fd.restitution = 0;
  
      // Create the body
      this.body = world.CreateBody(bd);
      // Attach the fixture
      this.body.CreateFixture(fd);
  
      // Some additional stuff
      this.body.SetLinearVelocity(new box2d.b2Vec2(random(-5, 5), random(2, 5)));
      this.body.SetAngularVelocity(random(-5, 5));
    }
  
    // This function removes the particle from the box2d world
    killBody() {
      world.DestroyBody(this.body);
    }
  
    // Is the particle ready for deletion?
    done() {
      // Let's find the screen position of the particle
      let transform = this.body.GetTransform();
      let pos = scaleToPixels(transform.position);
      // Is it off the bottom of the screen?
      if (pos.y > height + this.r * 2) {
        this.killBody();
        return true;
      }
      return false;
    }

    contains(x, y) {
      let worldPoint = scaleToWorld(x, y);
      let f = this.body.GetFixtureList();
      let inside = f.TestPoint(worldPoint);
      return inside;
    }
  
    // Drawing the Particle
    display() {
      // Get the body's position
      let pos = scaleToPixels(this.body.GetPosition());
      // Get its angle of rotation
      let a = this.body.GetAngleRadians();
  
      // Draw it!
      ellipseMode(CENTER);
      push();
      translate(pos.x, pos.y);
      rotate(a);
      fill(197, 234, 250);
      noStroke();
      ellipse(0, 0, this.r, this.r);
      pop();
    }
  }





  class ChemicalParticle {
    constructor(x, y, r) {
      this.r = r;
  
      // Define a body
      let bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position = scaleToWorld(x, y);
  
      // Define a fixture
      let fd = new box2d.b2FixtureDef();
      // Fixture holds shape
      fd.shape = new box2d.b2PolygonShape();
      fd.shape.SetAsBox(scaleToWorld(this.r / 2), scaleToWorld(this.r / 2));
  
      // Some physics
      fd.density = 1.0;
      fd.friction = 0.1;
      fd.restitution = 0.3;
  
      // Create the body
      this.body = world.CreateBody(bd);
      // Attach the fixture
      this.body.CreateFixture(fd);
  
      // Some additional stuff
      this.body.SetLinearVelocity(new box2d.b2Vec2(random(-5, 5), random(2, 5)));
      this.body.SetAngularVelocity(random(-5, 5));
    }
  
    // This function removes the particle from the box2d world
    killBody() {
      world.DestroyBody(this.body);
    }
  
    // Is the particle ready for deletion?
    done() {
      // Let's find the screen position of the particle
      let transform = this.body.GetTransform();
      let pos = scaleToPixels(transform.position);
      // Is it off the bottom of the screen?
      if (pos.y > height + this.r * 2) {
        this.killBody();
        return true;
      }
      return false;
    }

    contains(x, y) {
      let worldPoint = scaleToWorld(x, y);
      let f = this.body.GetFixtureList();
      let inside = f.TestPoint(worldPoint);
      return inside;
    }
  
    // Drawing the Particle
    display() {
      // Get the body's position
      let pos = scaleToPixels(this.body.GetPosition());
      // Get its angle of rotation
      let a = this.body.GetAngleRadians();
  
      // Draw it!
      ellipseMode(CENTER);
      push();
      translate(pos.x, pos.y);
      rotate(a);
      fill(255, 200, 100);
      noStroke();
      ellipse(0, 0, this.r, this.r);
      pop();
    }
  }

  // Constructor
class CottonParticle {
  constructor(tex, x, y, r) {
    this.r = r;
    this.tex = tex;

    // Define a body
    let bd = new box2d.b2BodyDef();
    bd.type = box2d.b2BodyType.b2_dynamicBody;
    bd.position = scaleToWorld(x, y);

    // Define a fixture
    let fd = new box2d.b2FixtureDef();
    // Fixture holds shape
    fd.shape = new box2d.b2PolygonShape();
    fd.shape.SetAsBox(scaleToWorld(this.r / 2), scaleToWorld(this.r / 2));

    // Some physics
    fd.density = 0.5;
    fd.friction = 0.1;
    fd.restitution = 0.1;

    // Create the body
    this.body = world.CreateBody(bd);
    // Attach the fixture
    this.body.CreateFixture(fd);

    // Some additional stuff
    this.body.SetLinearVelocity(new box2d.b2Vec2(random(-5, 5), random(2, 5)));
    this.body.SetAngularVelocity(random(-5, 5));
  }

  // This function removes the particle from the box2d world
  killBody() {
    world.DestroyBody(this.body);
  }

  // Is the particle ready for deletion?
  done() {
    // Let's find the screen position of the particle
    let transform = this.body.GetTransform();
    let pos = scaleToPixels(transform.position);
    // Is it off the bottom of the screen?
    if (pos.y > height + this.r * 2) {
      this.killBody();
      return true;
    }
    return false;
  }

  contains(x, y) {
    let worldPoint = scaleToWorld(x, y);
    let f = this.body.GetFixtureList();
    let inside = f.TestPoint(worldPoint);
    return inside;
  }

  // Drawing the Particle
  display() {
    // Get the body's position
    let pos = scaleToPixels(this.body.GetPosition());
    // Get its angle of rotation
    let a = this.body.GetAngleRadians();

    // Draw it!
    imageMode(CENTER);
    push();
    translate(pos.x, pos.y);
    rotate(a);
    image(this.tex, 0, 0, this.r, this.r);
    pop();
  }
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Child class constructor
function ClothParticle(position) {
  VerletParticle2D.call(this,position);

  // Override the display method
  this.display = function(){
    fill(127);
    stroke(200);
    strokeWeight(2);
    ellipse(this.x,this.y,32,32);
  }
}

// Inherit from the parent class
ClothParticle.prototype = Object.create(VerletParticle2D.prototype);
ClothParticle.prototype.constructor = ClothParticle;


// the color drop

class ColorParticle {
  constructor(col, x, y, r) {
    this.r = r;
    this.col = col

    // Define a body
    let bd = new box2d.b2BodyDef();
    bd.type = box2d.b2BodyType.b2_dynamicBody;
    bd.position = scaleToWorld(x, y);

    // Define a fixture
    let fd = new box2d.b2FixtureDef();
    // Fixture holds shape
    fd.shape = new box2d.b2PolygonShape();
    fd.shape.SetAsBox(scaleToWorld(this.r / 2), scaleToWorld(this.r / 2));

    // Some physics
    fd.density = 1.0;
    fd.friction = 0.1;
    fd.restitution = 0.3;

    // Create the body
    this.body = world.CreateBody(bd);
    // Attach the fixture
    this.body.CreateFixture(fd);

    // Some additional stuff
    this.body.SetLinearVelocity(new box2d.b2Vec2(random(-5, 5), random(2, 5)));
    this.body.SetAngularVelocity(random(-5, 5));
  }

  // This function removes the particle from the box2d world
  killBody() {
    world.DestroyBody(this.body);
  }

  // Is the particle ready for deletion?
  done() {
    // Let's find the screen position of the particle
    let transform = this.body.GetTransform();
    let pos = scaleToPixels(transform.position);
    // Is it off the bottom of the screen?
    if (pos.y > height + this.r * 2) {
      this.killBody();
      return true;
    }
    return false;
  }

  contains(x, y) {
    let worldPoint = scaleToWorld(x, y);
    let f = this.body.GetFixtureList();
    let inside = f.TestPoint(worldPoint);
    return inside;
  }

  // Drawing the Particle
  display() {
    // Get the body's position
    let pos = scaleToPixels(this.body.GetPosition());
    // Get its angle of rotation
    let a = this.body.GetAngleRadians();

    // Draw it!
    ellipseMode(CENTER);
    push();
    translate(pos.x, pos.y);
    rotate(a);
    fill(this.col);
    noStroke();
    ellipse(0, 0, this.r, this.r);
    pop();
  }
}

  // the labor particles
  class LaborParticle {
    constructor(tex, x, y, r) {
      this.r = r;
      this.tex = tex;
  
      // Define a body
      let bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position = scaleToWorld(x, y);
  
      // Define a fixture
      let fd = new box2d.b2FixtureDef();
      // Fixture holds shape
      fd.shape = new box2d.b2PolygonShape();
      fd.shape.SetAsBox(scaleToWorld(this.r / 2), scaleToWorld(this.r / 2));
  
      // Some physics
      fd.density = 0.5;
      fd.friction = 0.1;
      fd.restitution = 0.1;
  
      // Create the body
      this.body = world.CreateBody(bd);
      // Attach the fixture
      this.body.CreateFixture(fd);
  
      // Some additional stuff
      this.body.SetLinearVelocity(new box2d.b2Vec2(random(-5, 5), random(2, 5)));
      this.body.SetAngularVelocity(random(-5, 5));
    }
  
    // This function removes the particle from the box2d world
    killBody() {
      world.DestroyBody(this.body);
    }
  
    // Is the particle ready for deletion?
    done() {
      // Let's find the screen position of the particle
      let transform = this.body.GetTransform();
      let pos = scaleToPixels(transform.position);
      // Is it off the bottom of the screen?
      if (pos.y > height + this.r * 2) {
        this.killBody();
        return true;
      }
      return false;
    }
  
    contains(x, y) {
      let worldPoint = scaleToWorld(x, y);
      let f = this.body.GetFixtureList();
      let inside = f.TestPoint(worldPoint);
      return inside;
    }
  
    // Drawing the Particle
    display() {
      // Get the body's position
      let pos = scaleToPixels(this.body.GetPosition());
      // Get its angle of rotation
      let a = this.body.GetAngleRadians();
  
      // Draw it!
      imageMode(CENTER);
      push();
      translate(pos.x, pos.y);
      rotate(a);
      image(this.tex, 0, 0, this.r, this.r);
      pop();
    }
  }
  


