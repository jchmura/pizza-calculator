import {LitElement, html, css} from 'lit-element';
import {setPassiveTouchGestures} from '@polymer/polymer/lib/utils/settings.js';

// These are the elements needed by this element.
import './pizza-view';
import './settings'

class PizzaApp extends LitElement {
  static get properties() {
    return {
      _offline: {type: Boolean}
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          min-height: 100%;

          --app-primary-color: #455a64;
          --app-secondary-color: #ff6f00;
          --app-dark-text-color: #102027;
          --app-light-text-color: white;

          --mdc-theme-primary: var(--app-secondary-color);
        }
        
        .container {
          min-height: 100%;
          display: flex;
          flex-direction: column;
          position: absolute;
          top:      0;
          bottom:   0;
          left:     0;
          right:    0;
          margin:   auto;
        }
        
        pizza-settings {
          /*position: relative;*/
          /*right: 20px;*/
          /*bottom: 20px;*/
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
          flex: 1 0 auto;
        }

        .main-content {
          padding-top: 48px;
          padding-bottom: 24px;
        }

        .page {
          display: block;
        }
        
        footer {
          flex-shrink: 0;
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background-color: var(--app-primary-color);
          color: var(--app-light-text-color);
        }
        
        footer > span {
          margin: auto 0;
          padding: 0 12px;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="container">
        <main role="main" class="main-content">
          <pizza-view class="page"></pizza-view>
        </main>
        <footer>
          <span>Made by Jakub Chmura</span>
          <pizza-settings></pizza-settings>
        </footer>
      </div>

    `;
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
  }
}

window.customElements.define('pizza-app', PizzaApp);
