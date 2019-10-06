import {LitElement, html, css} from 'lit-element';
import {classMap} from "lit-html/directives/class-map";
import {MaterialCardStyles, MaterialElevationStyles} from "./shared-styles";
import './pizza-textfield.js';
import {Pizza} from "./pizza";
import {getCurrency, getDistanceUnit} from './settings';

class PizzaItem extends LitElement {
  static get properties() {
    return {
      pizza: {type: Object},
      details: {type: Boolean},
      elevated: {type: Boolean},
      country: {type: String},
      currency: {type: String},
      distanceUnit: {type: String}
    };
  }

  static get styles() {
    return [
      MaterialCardStyles,
      MaterialElevationStyles,
      css`
        :host {
          margin: auto 12px 12px;
        }
        .container {
          margin: auto;
          padding: 18px;
        }
        
        .card-header {
          text-align: center;
        }
        
        pizza-textfield {
          margin: 8px auto;
        }
        
        .details {
          margin-top: 1.5em;
  
        }
        
        .details > p {
          color: rgba(0, 0, 0, 0.6);
          font-size: 0.9rem;
          letter-spacing: 0.009375em;
          margin: 0.3em auto;
          line-height: 1.15rem;;
        }
        
        .price-per-area {
          font-weight: 500;
          font-size: 1rem;
          color: rgba(0, 0, 0, 0.8);;
        }
      `
    ]


  }

  render() {
    return html`
<!--      <link rel="stylesheet" href="../../node_modules/@material/card/dist/mdc.card.min.css">-->
<!--      <link rel="stylesheet" href="../../node_modules/@material/elevation/dist/mdc.elevation.min.css">-->
<!--      <link rel="import" href="./styles.html">-->
      
      <div class="container mdc-card ${classMap(this.elevation())} mdc-elevation-transition">
        <pizza-textfield
          label="Diameter (${this.distanceUnit})"
          type="number"
          value="${this.pizza.diameter}"
          min="1"
          @input="${(e) => this.changePizzaAttribute(e, 'diameter')}"
          @change="${(e) => this.changePizzaAttribute(e, 'diameter')}">
        </pizza-textfield>
        <pizza-textfield
          label="Price (${this.currency})"
          type="number"
          value="${this.pizza.price}"
          min="0.01"
          step="0.01"
          @input="${(e) => this.changePizzaAttribute(e, 'price')}"
          @change="${(e) => this.changePizzaAttribute(e, 'price')}">
        </pizza-textfield>
        <pizza-textfield
          label="Count"
          type="number"
          value="${this.pizza.count}"
          min="1"
          @input="${(e) => this.changePizzaAttribute(e, 'count')}"
          @change="${(e) => this.changePizzaAttribute(e, 'count')}">
        </pizza-textfield>
        
        ${this.printDetails()}
      </div>
    `;
  }

  constructor() {
    super();
    this.details = false;
    this.currency = getCurrency();
    this.distanceUnit = getDistanceUnit();
    window.addEventListener('settings-changed', (e) => this._settingsChanged(e));
  }

  printDetails() {
    if (this.details === true) {
      return html`
        <div class="details">
          <p>Total Price: ${this.printTotalPrice()}</p>
          <p>Total Area: ${this.printTotalArea()}</p>
          <p class="price-per-area">Price per Area: ${this.printPricePerArea()}</p>  
        </div>
      `;
    } else {
      return '';
    }
  }

  getLocale() {
    if (navigator.languages && navigator.languages.length) {
      return navigator.languages[0];
    } else {
      return navigator.userLanguage || navigator.language || navigator.browserLanguage;
    }
  }

  printTotalPrice() {
    return this.pizza.totalPrice().toLocaleString(this.getLocale(), {style: 'currency', currency: this.currency, maximumFractionDigits: 2});
  }

  printTotalArea() {
    return this.pizza.totalArea().toLocaleString(this.getLocale(), {maximumFractionDigits: 2}) + '\xa0' + this.distanceUnit + '\xB2';
  }

  printPricePerArea() {
    return this.pizza.pricePerArea().toLocaleString(this.getLocale(), {style: 'currency', currency: this.currency, currencyDisplay: 'symbol', maximumFractionDigits: 4}) + '/' + this.distanceUnit + '\xB2';
  }

  changePizzaAttribute(e, attribute) {
    if (e.target.validity.valid === true) {
      this.pizza = Object.assign(new Pizza(), this.pizza, {[attribute]: e.target.value});
      this.pizzaChanged();
    }
  }

  pizzaChanged() {
    let event = new CustomEvent('pizza-changed', {
      detail: {
        pizza: this.pizza
      }
    });
    this.dispatchEvent(event);
  }

  elevation() {
    if (this.elevated) {
      return {'mdc-elevation--z10': true};
    } else {
      return {};
    }
  }

  _settingsChanged(e) {
    this.currency = e.detail.currency;
    this.distanceUnit = e.detail.distanceUnit;
  }
}

window.customElements.define('pizza-item', PizzaItem);
