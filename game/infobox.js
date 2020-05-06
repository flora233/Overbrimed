class Infobox {
    constructor(x, y,) {
        this.x = x;
        this.y = y;

        this.water_consume = 0;
        this.chemicals_consume = 0;
        this.water_output = 0;
        this.co2_output = 0;
        this.amount = 0;


    }

    display() {

        //result of this one
        noStroke();
        fill(100);
        textSize(22);
        textStyle(BOLD);
        //text("Produce  " + this.amount +"  kg cotton", this.x - 80, this.y - 50);

        //seg1
        strokeWeight(1);
        stroke(0);
        line(this.x - 90, this.y - 30, this.x + 180, this.y - 30);

        //input
        noStroke();
        fill(50);
        textSize(14);
        text("Input", this.x - 70, this.y);
        fill(0);
        textSize(14);
        text("Water   " + this.water_consume + "  Liters", this.x, this.y);
        text("Chemicals   " + this.chemicals_consume + "  Liters", this.x, this.y + 24);

        //seg2
        stroke(0);
        line(this.x - 90, this.y + 40, this.x + 180, this.y + 40);

        //output
        fill(50);
        noStroke();
        textSize(14);
        text("Output", this.x - 80, this.y + 80);
        fill(0);
        textSize(14);
        text("Polluted water   " + this.water_output, this.x, this.y + 80);
        text("CO2 emission   " + this.co2_output, this.x, this.y + 24 + 80);

        //seg3
        stroke(100);
        line(this.x - 90, this.y + 130, this.x + 180, this.y + 130);

    }
}


class Actionbox {
    constructor(x,y,sound) {
        this.x = x;
        this.y = y;
        this.sound = sound;

        this.should_add_water = false;
        this.should_add_pesticide = false;

        fill(0);
        text("Action Box", this.x - 80, this.y + 150);

        // water button

        this.water_button = createButton('Add Water');
        this.water_button.id('water_button');
        this.water_button.position(this.x - 80, this.y + 150);
        this.water_button.style('background-color', 'transparent');
        this.water_button.style('border', '1px solid black');
        this.water_button.style('cursor', 'pointer');

        this.water_button.mousePressed(this.addWater.bind(this));
        this.water_button.mouseReleased(this.stopaddwater.bind(this));

        // chemical button
        this.should_add_pesticide = false;
        this.pesticide_button = createButton('Add Pesticides');
        this.pesticide_button.position(this.x - 80, this.y + 195);
        this.pesticide_button.style('background-color', 'transparent');
        this.pesticide_button.style('border', '1px solid black');
        this.pesticide_button.style('cursor', 'pointer');

        this.pesticide_button.mousePressed(this.addPesticides.bind(this));
        this.pesticide_button.mouseReleased(this.stopaddpesticides.bind(this));

        // 
    }

    addWater() {
        this.should_add_water = true;
        this.sound.loop();
    }

    stopaddwater() {
        this.should_add_water = false;
        this.sound.stop();
    }

    addPesticides() {
        this.should_add_pesticide = true;
        this.sound.loop();
    }

    stopaddpesticides() {
        this.should_add_pesticide = false;
        this.sound.stop();
    }
}