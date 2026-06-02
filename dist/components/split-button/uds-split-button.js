const splitButtonSheet = new CSSStyleSheet();
let splitButtonStylesPromise = false;

let splitButtonTemplate = null;
let splitButtonTemplatePromise = false;

function ensureSplitButtonStyles() {
    if (splitButtonStylesPromise) return splitButtonStylesPromise;

    splitButtonStylesPromise = (async () => {
        const cssUrl = new URL('./uds-split-button.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await splitButtonSheet.replace(css);
    })();

    return splitButtonStylesPromise;
}

function ensureSplitButtonTemplate() {
    if (splitButtonTemplatePromise) return splitButtonTemplatePromise;

    splitButtonTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-split-button.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        splitButtonTemplate = document.createElement('template');
        splitButtonTemplate.innerHTML = templateText;
    })();

    return splitButtonTemplatePromise;
}

class UdsSplitButton extends HTMLElement {
    _splitButton = null;
    _slot = null;
    _button = null;
    _toggleButton = null;
  
    static get observedAttributes() {
        return ['type', 'variant', 'size', 'round'];
    }

    constructor() {
        super();

        this._onClick = this._onClick.bind(this);
        this.attachShadow({ mode: 'open', delegatesFocus: true });

        this.ready = new Promise(resolve => {
            this._resolveReady = resolve;
        });
    }

    async connectedCallback() {
        this._initDefaults();
        await this._render();

        this.constructor.observedAttributes.forEach(prop => {
            this._upgradeProperty(prop);
        });

        this.addEventListener('click', this._onClick);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this._onClick);
    }

    attributeChangedCallback() {
        this._updateState();
    }

    _upgradeProperty(prop) {
        if (this.hasOwnProperty(prop)) {
            const value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }

    _initDefaults() {
        if (!this.hasAttribute('type')) this.type = 'primary';
        if (!this.hasAttribute('variant')) this.variant = 'filled';
        if (!this.hasAttribute('size')) this.size = 'medium';
    }

    async _render() {
        if (!this.shadowRoot || this._splitButton) return;

        await Promise.all([
            ensureSplitButtonStyles(),
            ensureSplitButtonTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [splitButtonSheet];
        this.shadowRoot.appendChild(splitButtonTemplate.content.cloneNode(true));
            
        this._splitButton = this.shadowRoot.querySelector('.split-button');
        this._slot = this.shadowRoot.querySelector('slot');

        if (this._slot) {
            this._slot.addEventListener('slotchange', () => this._updateState());
        }

        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._splitButton) return;
        
        this._splitButton.classList.remove('split-button--filled', 'split-button--outline', 'split-button--ghost', 'split-button--text');
        this._splitButton.classList.add(`split-button--${this.variant}`);
        
        this._splitButton.classList.remove('split-button--primary', 'split-button--secondary', 'split-button--danger');
        this._splitButton.classList.add(`split-button--${this.type}`);
        
        this._splitButton.classList.remove('split-button--small', 'split-button--medium', 'split-button--large');
        this._splitButton.classList.add(`split-button--${this.size}`);

        this._splitButton.classList.toggle('split-button--round', this.round);

        const elements = this._slot?.assignedElements({ flatten: true }) || [];

        this._button = elements.find(el => el.matches('uds-button')) || null;
        this._toggleButton = elements.find(el => el.matches('uds-toggle-button')) || null;

        if (this._button) {
            this._button.type = this.type;
            this._button.variant = this.variant;
            this._button.size = this.size;
            this._button.round = false;
        }

        if (this._toggleButton) {
            this._toggleButton.type = this.type;
            this._toggleButton.variant = this.variant;
            this._toggleButton.size = this.size;
            this._toggleButton.round = false;
        }
    }

    _onClick(event) {
        const path = event.composedPath();

        if (this._button && path.includes(this._button)) {
            this.dispatchEvent(new CustomEvent('uds-click', {
                bubbles: true,
                composed: true,
                detail: { originalEvent: event }
            }));
        }

        if (this._toggleButton && path.includes(this._toggleButton)) {
            this.dispatchEvent(new CustomEvent('uds-toggle-click', {
                bubbles: true,
                composed: true,
                detail: { originalEvent: event }
            }));
        }
    }
  
    get type() {
        return this.getAttribute('type');
    }
  
    set type(value) {
        this.setAttribute('type', value);
    }

    get variant() {
        return this.getAttribute('variant');
    }
  
    set variant(value) {
        this.setAttribute('variant', value);
    }
  
    get size() {
        return this.getAttribute('size');
    }
  
    set size(value) {
        this.setAttribute('size', value);
    }
  
    get round() {
        return this.hasAttribute('round');
    }
  
    set round(value) {
        this.toggleAttribute('round', !!value);
    }
}

customElements.define('uds-split-button', UdsSplitButton);

export default UdsSplitButton;