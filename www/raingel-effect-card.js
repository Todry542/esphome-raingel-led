const DEFAULT_ENTITY = 'light.raingeled_raingel_led';
const DEFAULT_SERVICE = 'esphome.raingeled_set_effect';

const I18N = {
  en: {
    card: {
      title: 'Raingel Effect Control',
      type: 'Type',
      style: 'Effect',
      palette: 'Palette',
      brightness: 'Brightness',
      speed: 'Speed',
      apply: 'Apply',
      status_on: 'Status:',
      status_off: 'Status:',
      last_effect: 'Last effect:',
      power_on: 'Turn On',
      power_off: 'Turn Off',
      none: 'None',
      not_found: 'not found'
    },
    modes: {
      rgb: {
        label: 'RGB (5 effects)',
        styles: {
          0: 'Static',
          1: 'Fade',
          2: 'Jump',
          3: 'Breathe',
          4: 'Flash'
        },
        palettes: {
          0: 'Orange & white',
          1: 'Violet & orange',
          2: 'Cyan & violet',
          3: 'Yellow & cyan',
          4: 'Blue & yellow',
          5: 'Green & blue',
          6: 'Red & green',
          7: 'Violet-orange-white',
          8: 'Cyan-violet-orange',
          9: 'Yellow-cyan-violet',
          10: 'Blue-yellow-cyan',
          11: 'Green-blue-yellow',
          12: 'Red-green-blue',
          13: 'Cyan-violet-orange-white',
          14: 'Yellow-cyan-violet-orange',
          15: 'Blue-yellow-cyan-violet',
          16: 'Green-blue-yellow-cyan',
          17: 'Red-green-blue-yellow',
          18: 'Yellow-cyan-violet-orange-white',
          19: 'Blue-yellow-cyan-violet-orange',
          20: 'Green-blue-yellow-cyan-violet',
          21: 'Red-green-blue-yellow-cyan',
          22: 'Blue-yellow-cyan-violet-orange-white',
          23: 'Green-blue-yellow-cyan-violet-orange',
          24: 'Red-green-blue-yellow-cyan-violet',
          25: 'Rainbow 7 (mix)',
          26: 'Green to white (7)',
          27: 'Red to orange (7)',
          28: 'Rainbow 8 (mix)',
          29: 'Rainbow 8'
        }
      },
      magic: {
        label: 'Magic (18 effects)',
        styles: {
          0: 'Fade',
          1: 'Jump',
          2: 'Breathe',
          3: 'Flash',
          4: 'Meteor',
          5: 'Cascade',
          6: 'Floating',
          7: 'Chasing',
          8: 'Wave',
          9: "Water stream",
          10: 'Scrolling rainbow',
          11: 'Blinking',
          12: 'Bounce',
          13: 'Shuttle',
          14: 'Twinkle',
          15: 'On/Off',
          16: 'Curtain',
          17: 'Alternate'
        },
        palettes: {
          0: 'Red & green',
          1: 'Red & blue',
          2: 'Green & blue',
          3: 'Red-green-blue',
          4: 'Blue-yellow-cyan',
          5: 'Cyan-violet-orange',
          6: 'Red-green-blue-yellow',
          7: 'Green-blue-yellow-cyan',
          8: 'Blue-yellow-cyan-violet',
          9: 'Red to cyan (5)',
          10: 'Green to violet (5)',
          11: 'Blue to orange (5)',
          12: 'Red to violet (6)',
          13: 'Green to orange (6)',
          14: 'Blue to white (6)',
          15: 'Red to orange (7)',
          16: 'Green to white (7)',
          17: 'Rainbow 7 (mix)',
          18: 'Rainbow 8'
        }
      }
    }
  },
  fr: {
    card: {
      title: 'Contrôle Effet Raingel',
      type: 'Type',
      style: 'Effet',
      palette: 'Palette',
      brightness: 'Luminosité',
      speed: 'Vitesse',
      apply: 'Appliquer',
      status_on: 'État :',
      status_off: 'État :',
      last_effect: 'Dernier effet :',
      power_on: 'Allumer',
      power_off: 'Éteindre',
      none: 'Aucun',
      not_found: 'introuvable'
    },
    modes: {
      rgb: {
        label: 'RGB (5 effets)',
        styles: {
          0: 'Statique',
          1: 'Fondu',
          2: 'Saut',
          3: 'Respiration',
          4: 'Eclair'
        },
        palettes: {
          0: 'Orange & blanc',
          1: 'Violet & orange',
          2: 'Cyan & violet',
          3: 'Jaune & cyan',
          4: 'Bleu & jaune',
          5: 'Vert & bleu',
          6: 'Rouge & vert',
          7: 'Violet-orange-blanc',
          8: 'Cyan-violet-orange',
          9: 'Jaune-cyan-violet',
          10: 'Bleu-jaune-cyan',
          11: 'Vert-bleu-jaune',
          12: 'Rouge-vert-bleu',
          13: 'Cyan-violet-orange-blanc',
          14: 'Jaune-cyan-violet-orange',
          15: 'Bleu-jaune-cyan-violet',
          16: 'Vert-bleu-jaune-cyan',
          17: 'Rouge-vert-bleu-jaune',
          18: 'Jaune-cyan-violet-orange-blanc',
          19: 'Bleu-jaune-cyan-violet-orange',
          20: 'Vert-bleu-jaune-cyan-violet',
          21: 'Rouge-vert-bleu-jaune-cyan',
          22: 'Bleu-jaune-cyan-violet-orange-blanc',
          23: 'Vert-bleu-jaune-cyan-violet-orange',
          24: 'Rouge-vert-bleu-jaune-cyan-violet',
          25: 'Arc-en-ciel 7 (melange)',
          26: 'Vert a blanc (7)',
          27: 'Rouge a orange (7)',
          28: 'Arc-en-ciel 8 (melange)',
          29: 'Arc-en-ciel 8'
        }
      },
      magic: {
        label: 'Magic (18 effets)',
        styles: {
          0: 'Fondu',
          1: 'Saut',
          2: 'Respiration',
          3: 'Eclair',
          4: 'Meteore',
          5: 'Cascade',
          6: 'Flottant',
          7: 'Poursuite',
          8: 'Vague',
          9: "Courant d'eau",
          10: 'Arc-en-ciel defilant',
          11: 'Clignotement',
          12: 'Rebond',
          13: 'Navette',
          14: 'Scintillement',
          15: 'Allumage/Extinction',
          16: 'Rideau',
          17: 'Alterne'
        },
        palettes: {
          0: 'Rouge & vert',
          1: 'Rouge & bleu',
          2: 'Vert & bleu',
          3: 'Rouge-vert-bleu',
          4: 'Bleu-jaune-cyan',
          5: 'Cyan-violet-orange',
          6: 'Rouge-vert-bleu-jaune',
          7: 'Vert-bleu-jaune-cyan',
          8: 'Bleu-jaune-cyan-violet',
          9: 'Rouge a cyan (5)',
          10: 'Vert a violet (5)',
          11: 'Bleu a orange (5)',
          12: 'Rouge a violet (6)',
          13: 'Vert a orange (6)',
          14: 'Bleu a blanc (6)',
          15: 'Rouge a orange (7)',
          16: 'Vert a blanc (7)',
          17: 'Arc-en-ciel 7 (melange)',
          18: 'Arc-en-ciel 8'
        }
      }
    }
  }
};

// Rendre I18N globalement accessible (Home Assistant charge ce fichier en <script type="module">)
window.I18N = I18N;

const MODES = {
  rgb: {
    label: 'modes.rgb.label',
    defaultPalette: 29,
    styles: ['modes.rgb.styles.0', 'modes.rgb.styles.1', 'modes.rgb.styles.2', 'modes.rgb.styles.3', 'modes.rgb.styles.4'],
    palettes: [
      'modes.rgb.palettes.0', 'modes.rgb.palettes.1', 'modes.rgb.palettes.2', 'modes.rgb.palettes.3',
      'modes.rgb.palettes.4', 'modes.rgb.palettes.5', 'modes.rgb.palettes.6',
      'modes.rgb.palettes.7', 'modes.rgb.palettes.8', 'modes.rgb.palettes.9',
      'modes.rgb.palettes.10', 'modes.rgb.palettes.11', 'modes.rgb.palettes.12',
      'modes.rgb.palettes.13', 'modes.rgb.palettes.14',
      'modes.rgb.palettes.15', 'modes.rgb.palettes.16', 'modes.rgb.palettes.17',
      'modes.rgb.palettes.18', 'modes.rgb.palettes.19',
      'modes.rgb.palettes.20', 'modes.rgb.palettes.21',
      'modes.rgb.palettes.22', 'modes.rgb.palettes.23',
      'modes.rgb.palettes.24',
      'modes.rgb.palettes.25', 'modes.rgb.palettes.26', 'modes.rgb.palettes.27',
      'modes.rgb.palettes.28', 'modes.rgb.palettes.29',
    ],
  },
  magic: {
    label: 'modes.magic.label',
    defaultPalette: 18,
    styles: [
      'modes.magic.styles.0', 'modes.magic.styles.1', 'modes.magic.styles.2', 'modes.magic.styles.3',
      'modes.magic.styles.4', 'modes.magic.styles.5', 'modes.magic.styles.6', 'modes.magic.styles.7',
      'modes.magic.styles.8', 'modes.magic.styles.9', 'modes.magic.styles.10',
      'modes.magic.styles.11', 'modes.magic.styles.12', 'modes.magic.styles.13',
      'modes.magic.styles.14', 'modes.magic.styles.15', 'modes.magic.styles.16', 'modes.magic.styles.17',
    ],
    palettes: [
      'modes.magic.palettes.0', 'modes.magic.palettes.1', 'modes.magic.palettes.2', 'modes.magic.palettes.3',
      'modes.magic.palettes.4', 'modes.magic.palettes.5', 'modes.magic.palettes.6',
      'modes.magic.palettes.7', 'modes.magic.palettes.8', 'modes.magic.palettes.9',
      'modes.magic.palettes.10', 'modes.magic.palettes.11', 'modes.magic.palettes.12',
      'modes.magic.palettes.13', 'modes.magic.palettes.14', 'modes.magic.palettes.15',
      'modes.magic.palettes.16', 'modes.magic.palettes.17', 'modes.magic.palettes.18',
    ],
  },
};

const CARD_STYLE = `
  .header {
    padding: 16px 16px 0;
    font-size: var(--ha-card-header-font-size, 24px);
    font-weight: 400;
    color: var(--ha-card-header-color, var(--primary-text-color));
  }
  .content { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
  .group { display: flex; flex-direction: column; gap: 6px; }
  label {
    display: flex; justify-content: space-between;
    font-size: 14px; color: var(--secondary-text-color);
  }
  label .val { color: var(--primary-text-color); font-weight: 500; }
  select {
    width: 100%; box-sizing: border-box; padding: 10px 12px;
    font-size: 14px; font-family: inherit;
    color: var(--primary-text-color);
    background: var(--card-background-color, var(--ha-card-background));
    border: 1px solid var(--divider-color);
    border-radius: 8px;
  }
  select:focus { outline: none; border-color: var(--primary-color); }
  input[type=range] { width: 100%; accent-color: var(--primary-color); }
  button {
    padding: 10px 16px; font-size: 14px; font-weight: 500; font-family: inherit;
    color: var(--text-primary-color, #fff);
    background: var(--primary-color);
    border: none; border-radius: 8px; cursor: pointer;
  }
  button:hover { filter: brightness(1.1); }
  button:active { filter: brightness(0.9); }
  button.power {
    color: var(--primary-text-color);
    background: var(--secondary-background-color, transparent);
    border: 1px solid var(--divider-color);
  }
  button.power.on {
    color: var(--text-primary-color, #fff);
    background: var(--state-light-active-color, var(--primary-color));
    border-color: transparent;
  }
  .state {
    display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;
    padding-top: 12px; border-top: 1px solid var(--divider-color);
    font-size: 13px; color: var(--secondary-text-color);
  }
  .state strong { color: var(--primary-text-color); }
`;

const CARD_HTML = `
  <div class="header"></div>
  <div class="content">
    <button id="power" class="power" type="button"></button>
    <div class="group"><label for="mode" id="lbl-mode"></label><select id="mode"></select></div>
    <div class="group"><label for="style" id="lbl-style"></label><select id="style"></select></div>
    <div class="group"><label for="palette" id="lbl-palette"></label><select id="palette"></select></div>
    <div class="group">
      <label for="brightness" id="lbl-brightness"><span class="lbl"></span> <span class="val" id="brightness-val"></span></label>
      <input type="range" id="brightness" min="0" max="100">
    </div>
    <div class="group">
      <label for="speed" id="lbl-speed"><span class="lbl"></span> <span class="val" id="speed-val"></span></label>
      <input type="range" id="speed" min="0" max="100">
    </div>
    <button id="apply" type="button"></button>
    <div class="state">
      <span id="status-on-wrap"><span id="lbl-status-on"></span> <strong id="status-on"></strong></span>
      <span id="status-effect-wrap"><span id="lbl-status-effect"></span> <strong id="status-effect"></strong></span>
    </div>
  </div>
`;

class RaingelEffectCard extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._entityId = DEFAULT_ENTITY;
    this._service = DEFAULT_SERVICE;
    this._hass = null;
    this._built = false;
    this._els = {};
    this._language = this._detectLanguage();

    // État propre à la carte (dernier réglage envoyé)
    this._mode = 'rgb';
    this._styleIndex = 0;
    this._paletteIndex = MODES.rgb.defaultPalette;
    this._brightness = 100;
    this._speed = 50;
    this._lastEffect = null;

    // Observer les changements d'URL pour la langue (query param ?l=)
    this._urlObserver = this._observeUrlChange.bind(this);
    this._lastUrlSearch = window.location.search;
    this._urlWatchInterval = setInterval(() => {
      const currentSearch = window.location.search;
      if (currentSearch !== this._lastUrlSearch) {
        this._lastUrlSearch = currentSearch;
        this._urlObserver();
      }
    }, 1000);
  }

  // ── API Lovelace ──
  setConfig(config) {
    this._config = config || {};
    this._entityId = this._config.entity_id || DEFAULT_ENTITY;
    this._service = this._config.service || DEFAULT_SERVICE;
    this._load();

    // Support option de configuration 'lang' (priorité la plus haute après variable globale)
    if (this._config.lang && I18N[this._config.lang]) {
      this._language = this._config.lang;
    } else {
      this._language = this._detectLanguage();
    }

    if (this._built) {
      this._els.header.textContent = this._title();
      this._syncControls();
      this._renderStatus();
    }
  }

  disconnectedCallback() {
    // Nettoyage de l'intervalle d'observation URL
    if (this._urlWatchInterval) {
      clearInterval(this._urlWatchInterval);
    }
  }

  set hass(hass) {
    const oldLang = this._language;
    this._hass = hass;
    // _detectLanguage() est déjà appelé dans setConfig (ou le constructeur),
    // mais on le rappelle ici pour appliquer la config HA si elle est disponible.
    // La priorité config.lang (si définie) est préservée.
    if (!this._config.lang) {
      this._language = this._detectLanguage(hass);
    }
    if (!this._built) {
      this._build();
    } else if (oldLang !== this._language) {
      this._syncControls();
      this._renderStatus();
    }
    this._renderStatus();
  }

  getCardSize() {
    return 6;
  }

  static getStubConfig() {
    return { entity_id: DEFAULT_ENTITY, title: 'Raingel' };
  }

  // ── Internationalisation ──
  _detectLanguage(hass) {
    // ── Priorité 1 : Variable globale (injection externe) ──
    // window.RaingelCardLang = 'en' avant chargement de la carte
    if (window.RaingelCardLang && I18N[window.RaingelCardLang]) {
      return window.RaingelCardLang;
    }

    // ── Priorité 2 : Paramètre URL : ?l=fr ──
    const rawSearch = window.location.search;
    const urlParams = new URLSearchParams(rawSearch);
    const langParam = urlParams.get('l');
    if (langParam) {
      const lang = langParam.split(/[_-]/)[0];
      if (I18N[lang]) return lang;
    }

    // ── Priorité 3 : sessionStorage (raingel-lang) ──
    try {
      const sessionLang = sessionStorage.getItem('raingel-lang');
      if (sessionLang && I18N[sessionLang]) return sessionLang;
    } catch (e) { /* sessionStorage indisponible */ }

    // ── Priorité 4 : localStorage (raingel-lang) ──
    try {
      const localLang = localStorage.getItem('raingel-lang');
      if (localLang && I18N[localLang]) return localLang;
    } catch (e) { /* localStorage indisponible */ }

    // ── Priorité 5 : Configuration Home Assistant ──
    if (hass && hass.config && hass.config.language) {
      return hass.config.language.split(/[_-]/)[0];
    }

    // ── Priorité 6 : Navigateur ──
    const navLang = navigator.language.split(/[_-]/)[0];
    if (navLang && I18N[navLang]) return navLang;

    // ── Priorité 7 : Fallback anglais ──
    return 'en';
  }

  /**
   * Observer les changements d'URL pour forcer le re-détection de langue.
   */
  _observeUrlChange() {
    const oldLang = this._language;
    this._language = this._detectLanguage(this._hass);
    if (oldLang !== this._language && this._built) {
      this._syncControls();
      this._renderStatus();
    }
  }

  /**
   * Traduire une clé comme 'modes.rgb.label' vers le texte correspondant.
   * @param {string} path - Chemin de la clé (ex: 'modes.rgb.label')
   * @returns {string} Le texte traduit ou la clé elle-même en fallback
   */
  t(path) {
    // Accès robuste à I18N
    const i18n = window.I18N || I18N;

    if (!i18n) {
      console.warn('raingel-effect-card: I18N non disponible');
      return path;
    }

    // Sélectionner le dictionnaire selon la langue
    let dict = i18n[this._language];
    if (!dict) {
      // Fallback vers 'en', puis première langue disponible
      dict = i18n['en'] || Object.values(i18n)[0];
      if (!dict) return path;
    }

    // Parcourir le chemin (ex: 'modes' -> 'rgb' -> 'label')
    const keys = path.split('.');
    let node = dict;
    let found = true;

    for (const key of keys) {
      if (node != null && typeof node === 'object' && key in node) {
        node = node[key];
      } else {
        found = false;
        break;
      }
    }

    return found ? node : path;
  }

  // ── Construction du DOM (une seule fois) ──
  _build() {
    const card = document.createElement('ha-card');
    card.innerHTML = `<style>${CARD_STYLE}</style>${CARD_HTML}`;
    this.appendChild(card);

    const q = (sel) => card.querySelector(sel);
    this._els = {
      header: q('.header'),
      power: q('#power'),
      mode: q('#mode'),
      style: q('#style'),
      palette: q('#palette'),
      brightness: q('#brightness'),
      brightnessVal: q('#brightness-val'),
      speed: q('#speed'),
      speedVal: q('#speed-val'),
      apply: q('#apply'),
      statusOn: q('#status-on'),
      statusEffect: q('#status-effect'),
      lblMode: q('#lbl-mode'),
      lblStyle: q('#lbl-style'),
      lblPalette: q('#lbl-palette'),
      lblBrightness: q('#lbl-brightness'),
      lblBrightnessText: q('#lbl-brightness .lbl'),
      lblSpeed: q('#lbl-speed'),
      lblSpeedText: q('#lbl-speed .lbl'),
      lblStatusOn: q('#lbl-status-on'),
      lblStatusEffect: q('#lbl-status-effect'),
    };

    this._els.header.textContent = this._title();

    // Type : réinitialise effet et palette, envoie immédiatement
    this._els.mode.addEventListener('change', () => {
      this._mode = this._els.mode.value;
      this._styleIndex = 0;
      this._paletteIndex = MODES[this._mode].defaultPalette;
      this._refreshLists();
      this._sendEffect();
    });

    // Effet / palette : envoi immédiat
    this._els.style.addEventListener('change', () => {
      this._styleIndex = parseInt(this._els.style.value, 10);
      this._sendEffect();
    });
    this._els.palette.addEventListener('change', () => {
      this._paletteIndex = parseInt(this._els.palette.value, 10);
      this._sendEffect();
    });

    // Sliders : appliqués via le bouton
    this._els.brightness.addEventListener('input', () => {
      this._brightness = parseInt(this._els.brightness.value, 10);
      this._els.brightnessVal.textContent = this._brightness + '%';
    });
    this._els.speed.addEventListener('input', () => {
      this._speed = parseInt(this._els.speed.value, 10);
      this._els.speedVal.textContent = this._speed + '%';
    });

    this._els.apply.addEventListener('click', () => this._sendEffect());

    this._els.power.addEventListener('click', () => {
      if (!this._hass) return;
      const on = this._isOn();
      this._hass.callService('light', on ? 'turn_off' : 'turn_on', { entity_id: this._entityId });
    });

    this._built = true;
    this._syncControls();
  }

  // ── Helpers DOM ──
  _title() {
    return this._config.title || this.t('card.title');
  }

  _fillSelect(select, options, selected) {
    select.replaceChildren(
      ...options.map((opt) => {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.label;
        o.selected = String(opt.value) === String(selected);
        return o;
      }),
    );
  }

  _refreshLists() {
    const m = MODES[this._mode];
    this._fillSelect(this._els.style, m.styles.map((key, value) => ({ value, label: this.t(key) })), this._styleIndex);
    this._fillSelect(this._els.palette, m.palettes.map((key, value) => ({ value, label: this.t(key) })), this._paletteIndex);
  }

  // Applique l'état interne aux contrôles
  _syncControls() {
    this._fillSelect(
      this._els.mode,
      Object.entries(MODES).map(([value, m]) => ({ value, label: this.t(m.label) })),
      this._mode
    );
    this._els.mode.value = this._mode;
    this._refreshLists();
    this._els.brightness.value = this._brightness;
    this._els.brightnessVal.textContent = this._brightness + '%';
    this._els.speed.value = this._speed;
    this._els.speedVal.textContent = this._speed + '%';

    // Update labels
    this._els.lblMode.textContent = this.t('card.type');
    this._els.lblStyle.textContent = this.t('card.style');
    this._els.lblPalette.textContent = this.t('card.palette');
    this._els.lblBrightnessText.textContent = this.t('card.brightness');
    this._els.lblSpeedText.textContent = this.t('card.speed');
    this._els.lblStatusOn.textContent = this.t('card.status_on');
    this._els.lblStatusEffect.textContent = this.t('card.last_effect');
    this._els.apply.textContent = this.t('card.apply');
  }

  // ── Statut (seul l'état on/off vient de l'entité) ──
  _isOn() {
    const s = this._hass?.states?.[this._entityId];
    return !!s && s.state === 'on';
  }

  _setText(el, text) {
    if (el.textContent !== text) el.textContent = text;
  }

  _getTranslatedEffectLabel() {
    if (!this._lastEffect) return null;
    const parts = this._lastEffect.split(' · ');
    if (parts.length === 2) {
      return `${this.t(parts[0])} · ${this.t(parts[1])}`;
    }
    return this.t(this._lastEffect);
  }

  _renderStatus() {
    if (!this._built) return;
    const s = this._hass && this._hass.states[this._entityId];
    const on = !!s && s.state === 'on';

    this._setText(this._els.power, on ? this.t('card.power_off') : this.t('card.power_on'));
    this._els.power.classList.toggle('on', on);
    this._setText(this._els.statusOn, s ? s.state : this.t('card.not_found'));
    this._setText(this._els.statusEffect, this._getTranslatedEffectLabel() || this.t('card.none'));
  }

  _effectLabel() {
    const m = MODES[this._mode];
    if (!m) return null;
    return `${m.styles[this._styleIndex]} · ${m.palettes[this._paletteIndex]}`;
  }

  // ── Persistance ──
  _storageKey() {
    return 'raingel-effect-card:' + this._entityId;
  }

  _save() {
    try {
      localStorage.setItem(this._storageKey(), JSON.stringify({
        mode: this._mode,
        style: this._styleIndex,
        palette: this._paletteIndex,
        speed: this._speed,
        brightness: this._brightness,
        effect: this._lastEffect,
      }));
    } catch (e) { /* stockage indisponible */ }
  }

  _load() {
    try {
      const d = JSON.parse(localStorage.getItem(this._storageKey()) || 'null');
      if (!d) return;
      const mode = MODES[d.mode] ? d.mode : 'rgb';
      const m = MODES[mode];
      const inRange = (v, len) => Number.isInteger(v) && v >= 0 && v < len;

      this._mode = mode;
      this._styleIndex = inRange(d.style, m.styles.length) ? d.style : 0;
      this._paletteIndex = inRange(d.palette, m.palettes.length) ? d.palette : m.defaultPalette;
      if (inRange(d.speed, 101)) this._speed = d.speed;
      if (inRange(d.brightness, 101)) this._brightness = d.brightness;
      this._lastEffect = d.effect || null;
    } catch (e) { /* ignore */ }
  }

  // ── Appel du service ──
  async _sendEffect() {
    if (!this._hass) return;
    const isMagic = this._mode === 'magic';
    // RGB : 0 (statique) à 4 / Magic : 1 à 18
    const modeId = isMagic ? this._styleIndex + 1 : this._styleIndex;
    const parts = this._service.split('.');
    if (parts.length !== 2) {
      console.error('raingel-effect-card: service must be in format "domain.service" (e.g., "esphome.raingel_set_effect")');
      return;
    }
    const [domain, service] = parts;

    try {
      await this._hass.callService(domain, service, {
        mode_id: modeId,
        palette_index: this._paletteIndex,
        speed: this._speed,
        brightness: this._brightness,
        is_magic: isMagic,
      });
      this._lastEffect = this._effectLabel();
      this._save();
      this._renderStatus();
    } catch (err) {
      console.error('raingel-effect-card: erreur appel service', err);
    }
  }
}

if (!customElements.get('raingel-effect-card')) {
  customElements.define('raingel-effect-card', RaingelEffectCard);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === 'raingel-effect-card')) {
  window.customCards.push({
    type: 'raingel-effect-card',
    name: 'Raingel Effect Card',
    description: 'Effets, palettes, luminosité et vitesse du tube Raingel',
  });
}