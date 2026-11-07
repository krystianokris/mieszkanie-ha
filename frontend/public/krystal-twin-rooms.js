import './mieszkanie-rooms-card.js';

class KrystalTwinRooms extends HTMLElement {
  set panel(value) {
    if (this.config === value?.config?.rooms) return;
    this.config = value?.config?.rooms;
    this.show();
  }
  set route(value) {
    this.path = value?.path;
    this.show();
  }
  set hass(value) {
    this.ha = value;
    this.show();
  }
  connectedCallback() { this.show(); }
  show() {
    if (!this.isConnected || !this.config || !this.ha) return;
    const path = (this.path || location.pathname).split('/').filter(Boolean).at(-1);
    const view = this.config.views.find(item => item.path === path) ?? this.config.views[0];
    if (this.view !== view) {
      const {type, ...options} = view.cards[0];
      const card = document.createElement(type.replace(/^custom:/, ''));
      card.setConfig(options);
      this.card = card;
      this.view = view;
      this.replaceChildren(card);
    }
    this.card.hass = this.ha;
  }
}
customElements.define('krystal-twin-rooms', KrystalTwinRooms);
