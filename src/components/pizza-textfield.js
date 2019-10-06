import {css} from 'lit-element';
import {TextField} from "@material/mwc-textfield";


class PizzaTextField extends TextField {

  static get styles() {
    return [
      TextField.styles,
      css`
        .mdc-text-field:not(.mdc-text-field--disabled) {
          background-color: transparent;
        }
        
        .mdc-text-field:hover::before {
          opacity: 0
        }
        
        .mdc-text-field__input {
          padding-bottom: 0;
          height: auto;
        }
        
        @media (max-width: 460px) {
          .mdc-floating-label {
            font-size: 0.8rem;
          }
          
          .mdc-text-field__input {
            padding: 10px 8px 0;
          }
          
          .mdc-text-field {
            height: 48px;
          }
          
          .mdc-text-field .mdc-floating-label {
            left: 8px;
          }
        }
      `]
  }

}

window.customElements.define('pizza-textfield', PizzaTextField);
