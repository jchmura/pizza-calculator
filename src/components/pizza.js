'use strict';

export class Pizza {

    constructor() {
        this.diameter = undefined;
        this.count = 1;
        this.price = undefined;
    }

    totalPrice() {
        return this.price * this.count;
    }

    totalArea() {
        return Math.PI * (this.diameter / 2) ** 2 * this.count;
    }

    pricePerArea() {
        return this.price * this.count / this.totalArea();
    }

    defined() {
        return this.diameter !== undefined && this.count !== undefined && this.price !== undefined;
    }

}