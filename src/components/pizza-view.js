import {html, LitElement, css} from 'lit-element';
import {styleMap} from "lit-html/directives/style-map";
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';

// These are the elements needed by this element.
import '@material/mwc-button';
import './pizza-item.js'
import {Pizza} from './pizza.js';
import {pizzaIcon} from './my-icons.js';

// These are the shared styles needed by this element.
import {SharedStyles} from './shared-styles.js';

const defaultIconPosition = 'calc(50% - (var(--size) + var(--padding) + var(--padding))/2)';

class PizzaView extends LitElement {
  static get properties() {
    return {
      // This is the data from the store.
      _pizza1: {type: Object},
      _pizza2: {type: Object},
      _betterPizza: {type: String},
      _details: {type: Boolean},
      _ready: {type: Boolean},
      _iconPosition: {type: String},
      _iconCenter: {type: Number}
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        h2 {
          margin-block-start: 0.3em;
          margin-block-end: 0.3em;
        }
        
        section {
          padding: 0;
        }
        
        #pizza-icons {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: 100%;
          align-items: center;
          justify-content: space-evenly;
        }

        .pizza-icon {
          --size: 48px;
          --padding: 16px;
          height: var(--size);
          width: var(--size);
          padding: var(--padding);
          position: relative;
          /*left: calc(50% - (--size + --padding + --padding)/2);*/
          transition: left 500ms ease;
        }
        
        .pizzas {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: 100%;
          align-items: center;
          justify-content: space-evenly;
          margin-bottom: 26px;
        }
        
        pizza-item {
          display: flex;
          flex-direction: column;
          flex-basis: 40%;
        }
        
        .button-section {
          text-align: center;
        }
        
        .button-section[hidden] {
          display: none;
        }
        
        @media (max-width: 460px) {
          .pizza-icon {
            --size: 32px;
            --padding: 12px;
          }
        }
        `
    ];
  }

  render() {
    return html`
      <section>
        <div>
        <h2>Which pizza is more profitable?</h2>
        <div id="pizza-icon" class="pizza-icon" style="${styleMap({left: this._iconPosition})}">${pizzaIcon}</div>        
        <div id="pizzas" class="pizzas">
          <pizza-item id="pizza1" .pizza="${this._pizza1}" .details="${this._details}" .elevated="${this._betterPizza === 'pizza1'}" @pizza-changed="${(e) => {this._pizza1 = e.detail.pizza; this.checkReady()}}"></pizza-item>
          <pizza-item id="pizza2" .pizza="${this._pizza2}" .details="${this._details}" .elevated="${this._betterPizza === 'pizza2'}" @pizza-changed="${(e) => {this._pizza2 = e.detail.pizza; this.checkReady()}}"></pizza-item>
        </div>
        <div class="button-section" ?hidden="${this._details === true}">
          <mwc-button raised label="Calculate" ?disabled="${this._ready === false}" @click="${this.calculate}"></mwc-button>
        </div>
        </div>
      </section>
    `;
  }

  constructor() {
    super();
    this._pizza1 = new Pizza();
    this._pizza2 = new Pizza();
    this._details = false;
    this._ready = false;
    this._iconPosition = defaultIconPosition;
    this._iconCenter = 40;
    installMediaQueryWatcher(`(max-width: 460px)`,
      (matches) => this._layoutChanged(matches));
    installMediaQueryWatcher(`(max-width: 318px)`,
      (matches) => {
        if (matches) {
          this._iconPosition = defaultIconPosition;
        } else {
          this.selectWinner();
        }
      });
    window.addEventListener('resize', () => this.calculateOffset());
  }

  checkReady() {
    if (this._pizza1.defined() && this._pizza2.defined()) {
      this._ready = true;
      this.selectWinner();
    }
  }

  calculate() {
    this._details = true;
    this.selectWinner();
  }

  selectWinner() {
    if (this._details === false) {
      return;
    }
    if (this._pizza1.pricePerArea() < this._pizza2.pricePerArea()) {
      this._betterPizza = 'pizza1';
    } else if (this._pizza1.pricePerArea() > this._pizza2.pricePerArea()) {
      this._betterPizza = 'pizza2';
    } else {
      this._betterPizza = undefined;
    }
    this.calculateOffset();
  }

  calculateOffset() {
    if (this._betterPizza === undefined) {
      this._iconPosition = defaultIconPosition;
    } else {
      let pizzas = this.shadowRoot.getElementById('pizzas');
      let pizzaIcon = this.shadowRoot.getElementById('pizza-icon');
      let pizza = this.shadowRoot.getElementById(this._betterPizza);

      this._iconPosition = pizza.offsetLeft - pizzas.offsetLeft + pizza.offsetWidth/2 - this._iconCenter + 'px';
    }
  }

  _layoutChanged(matches) {
    if (matches) {
      this._iconCenter = 28;
    } else {
      this._iconCenter = 40;
    }
  }
}

window.customElements.define('pizza-view', PizzaView);
