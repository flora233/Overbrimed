

class Infobox {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        
        this.water_input = 0; // estimated 3250 L of water per tshirt, 4% of the global fresh water withdraw
        //The percentage of water used in textile processing that goes into dying the fabrics, which, in many cases, leads to run off, thereby polluting nearby water sources
        this.energy_input = 0;
        this.chemical_input = 0;
        // -------
        this.solid_output = 0;
        this.pollutedwater_output = 0;
        this.carbon_output = 0;
        this.product_amount = 0; // 1 t-shirt
    }

    display() {
        push();
        translate(this.x, this.y);

        noStroke();
        fill(0);
        textSize(18);
        textAlign(RIGHT);
        text("water_input:  " + this.water_input + " Gallons", 0, 0);
        text("chemical_input:  " + this.chemical_input + "  Pounds", 0, 30);
        text("fuel_input:  " + this.energy_input + "  Pounds", 0, 60);
        text("product_output:  " + this.product_amount + "  Piece", 0, 90);

        stroke(0);
        //line(0, 80, 200, 80)

        // noStroke();
        // fill(100);
        // text("solid_waste_output:  " + this.solid_output + "  Pounds", 0, 100);
        // text("polluted_water_output:  " + this.pollutedwater_output + "  Pounds", 0, 130);
        // text("CO2_output:  " + this.carbon_output + "  Pounds", 0, 160);
        pop();
    }
}
