import {LitElement, html, css} from 'lit-element';
import {getCurrencyForCountry, isKnownCurrency} from "./currencies";
import {getDistanceUnitForCountry} from "./length";
import '../../node_modules/@material/mwc-icon-button'
import '../../node_modules/@material/mwc-dialog'
import '../../node_modules/@material/mwc-textfield'
import '../../node_modules/@material/mwc-button'
import '../../node_modules/@material/mwc-radio'
import '../../node_modules/@material/mwc-formfield'
import './pizza-textfield'

import {settingsIcon} from "./my-icons";

export function getCurrency() {
  return window.localStorage.getItem('currency') || getCurrencyForCountry(_getCountry());
}

export function getDistanceUnit() {
  return window.localStorage.getItem('distanceUnit') || getDistanceUnitForCountry(_getCountry());
}

function _getCountry() {
  if (navigator.languages && navigator.languages.length) {
    for (const language of navigator.languages) {
      let country = _getCountryFromLanguage(language);
      if (country !== undefined) {
        return country
      }
    }
  }
  return _getCountryFromLanguage(navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en-US');
}

function _getCountryFromLanguage(language) {
  let match = /-\b([A-Z]{2}\b)-?/.exec(language);
  if (match !== null) {
    return match[1];
  }
}

class Settings extends LitElement{
  static get properties() {
    return {
      country: {type: String},
      currency: {type: String},
      distanceUnit: {type: String},
      _dialogOpen: {type: Boolean},
      _valid: {type: Boolean}
    };
  }

  static get styles() {
    return css`
      .text-fields {
        display: flex;
        flex-direction: column;
      }

      pizza-textfield {
        margin-top: 4px;
        margin-bottom: 4px;
      }
      
      mwc-radio {
        --mdc-theme-secondary: var(--app-secondary-color);
      }
    `
  }

  render() {
    return html`
      <mwc-icon-button label="Settings" @click="${() => this._dialogOpen = true}">
        ${settingsIcon}
      </mwc-icon-button>
      
      <mwc-dialog title="Settings" ?open="${this._dialogOpen}" @closed="${(e) => this._dialogClosed(e)}">
        <div class="text-fields">
          <pizza-textfield
            id="currency"
            label="Currency"
            required
            value="${new String(this.currency)}"
            @change="${(e) => this._currencyChanged(e)}">
          </pizza-textfield>
          <div>
            <mwc-formfield alignEnd label="Distance Unit">
              <div>
                <mwc-formfield label="cm">
                  <mwc-radio id="cm" name="Distance Unit"></mwc-radio>
                </mwc-formfield>
                <mwc-formfield label="in">
                  <mwc-radio id="in" name="Distance Unit"></mwc-radio>
                </mwc-formfield>
              </div>
            </mwc-formfield>
          </div>
        </div>
        <mwc-button raised
          id="save-button"
          ?disabled="${!this._valid}"
          dialogAction="save"
          slot="primaryAction">
          Save
        </mwc-button>
        <mwc-button
          dialogAction="cancel"
          slot="secondaryAction">
          Cancel
        </mwc-button>
      </mwc-dialog>
    `;
  }

  constructor() {
    super();
    this.currency = getCurrency();
    this.distanceUnit = getDistanceUnit();
    this._dialogOpen = false;
    this._valid = true;
  }

  firstUpdated(_changedProperties) {
    this.shadowRoot.getElementById('currency').validityTransform = this._currencyValidity;
    this.shadowRoot.getElementById(this.distanceUnit).setAttribute('checked', '');
  }

  _dialogClosed(e) {
    this._dialogOpen = false;
    let action = e.detail.action;
    if (action === 'save') {
      this.currency = this.shadowRoot.getElementById('currency').value.toUpperCase();
      if (this.shadowRoot.getElementById('cm').hasAttribute('checked')) {
        this.distanceUnit = 'cm';
      } else {
        this.distanceUnit = 'in';
      }
      this._saveSettings();
      this._fireEvent();
    } else {
      this.shadowRoot.getElementById('currency').value = this.currency;
      this.shadowRoot.getElementById(this.distanceUnit).setAttribute('checked', '');
      this.shadowRoot.getElementById(this._otherDistanceUnit(this.distanceUnit)).removeAttribute('checked');
    }
  }

  _currencyChanged(e) {
    this._valid = e.target.validity.valid;
  }

  _currencyValidity(value, nativeValidity) {
    let knownCurrency = isKnownCurrency(value.toUpperCase());
    return {
      valid: knownCurrency,
      patternMismatch: !knownCurrency
    };
  }

  _otherDistanceUnit(distanceUnit) {
    if (distanceUnit === 'cm') {
      return 'in';
    } else {
      return 'cm';
    }
  }

  _saveSettings() {
    window.localStorage.setItem('currency', this.currency);
    window.localStorage.setItem('distanceUnit', this.distanceUnit);
  }

  _fireEvent() {
    let event = new CustomEvent('settings-changed', {
      detail: {
        currency: this.currency,
        distanceUnit: this.distanceUnit
      }
    });
    window.dispatchEvent(event);
  }
}

window.customElements.define('pizza-settings', Settings);
