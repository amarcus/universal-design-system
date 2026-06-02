const buttonSheet = new CSSStyleSheet();
let buttonStylesPromise = false;

let buttonTemplate = null;
let buttonTemplatePromise = false;

function ensureButtonStyles() {
    if (buttonStylesPromise) return buttonStylesPromise;

    buttonStylesPromise = (async () => {
        const cssUrl = new URL('./uds-button.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await buttonSheet.replace(css);
    })();

    return buttonStylesPromise;
}

function ensureButtonTemplate() {
    if (buttonTemplatePromise) return buttonTemplatePromise;

    buttonTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-button.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        buttonTemplate = document.createElement('template');
        buttonTemplate.innerHTML = templateText;
    })();

    return buttonTemplatePromise;
}

class UdsButton extends HTMLElement {
    _button = null;
    _label = null;
    _icon = null;
    _iconRight = null;
    _labelSlot = null;
    _iconSlot = null;
    _iconRightSlot = null;
    _counterElement = null;

    _labelVisible = true;
    _leftIconVisible = true;
    _rightIconVisible = true;
    _counterVisible = true;
  
    static get observedAttributes() {
        return ['type', 'variant', 'size', 'round', 'disabled', 'loading', 'scale', 'counter', 'active'];
    }

    constructor() {
        super();

        this._onClick = this._onClick.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
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
        this.addEventListener('keydown', this._onKeyDown);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this._onClick);
        this.removeEventListener('keydown', this._onKeyDown);
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
        if (!this.shadowRoot || this._button) return;

        await Promise.all([
            ensureButtonStyles(),
            ensureButtonTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [buttonSheet];
        this.shadowRoot.appendChild(buttonTemplate.content.cloneNode(true));
            
        this._button = this.shadowRoot.querySelector('.button');
        this._label = this.shadowRoot.querySelector('.label');
        this._icon = this.shadowRoot.querySelector('.icon');
        this._iconRight = this.shadowRoot.querySelector('.icon-right');
        this._labelSlot = this.shadowRoot.querySelector('slot:not([name])');
        this._iconSlot = this.shadowRoot.querySelector('slot[name="icon"]');
        this._iconRightSlot = this.shadowRoot.querySelector('slot[name="icon-right"]');
        this._counterElement = this.shadowRoot.querySelector('.counter');

        if (this._labelSlot) {
            this._labelSlot.addEventListener('slotchange', () => this._updateState());
        }

        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._button) return;
        
        this._button.classList.remove('button--filled', 'button--outline', 'button--ghost', 'button--text');
        this._button.classList.add(`button--${this.variant}`);
        
        this._button.classList.remove('button--primary', 'button--secondary', 'button--danger');
        this._button.classList.add(`button--${this.type}`);
        
        this._button.classList.remove('button--small', 'button--medium', 'button--large');
        this._button.classList.add(`button--${this.size}`);
        
        this._button.disabled = this.disabled;
        this._button.tabIndex = this.disabled ? -1 : 0;
        this._button.setAttribute('aria-disabled', String(this.disabled));

        this._button.classList.toggle('active', this.active);
        this._button.setAttribute('aria-pressed', String(this.active));

        this._button.classList.toggle('button--round', this.round);
        this._button.classList.toggle('button--scale', this.scale);
        this._button.classList.toggle('button--loading', this.loading);
        this._button.setAttribute('aria-busy', String(this.loading));

        const hasCounter = this.counter !== null;
        this._counterElement.textContent = hasCounter ? this.counter : '';
        this._counterElement.style.display = hasCounter && this._counterVisible ? '' : 'none';

        const hasLeftIcon = this._iconSlot?.assignedNodes({ flatten: true }).length > 0;
        this._icon.style.display = hasLeftIcon && this._leftIconVisible ? '' : 'none';

        const hasRightIcon = this._iconRightSlot?.assignedNodes({ flatten: true }).length > 0;
        this._iconRight.style.display = hasRightIcon && this._rightIconVisible ? '' : 'none';

        if (this._label && this._labelSlot) {
            const hasText = this._labelSlot.assignedNodes({ flatten: true }).some(node =>
                node.nodeType === Node.ELEMENT_NODE ||
                (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')
            );

            this._label.style.display = hasText && this._labelVisible ? '' : 'none';
        }
    }

    _onClick(event) {
        if (this.disabled || this.loading) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        
        this.dispatchEvent(new CustomEvent('uds-click', {
            bubbles: true,
            composed: true,
            detail: { originalEvent: event }
        }));
    }

    _onKeyDown(event) {
        if (this.disabled) return;

        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            this._button.classList.add('active');
            this.click();

            setTimeout(() => {
                if (!this.hasAttribute('active')) {
                    this._button.classList.remove('active');
                }
            }, 120);
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
  
    get disabled() {
        return this.hasAttribute('disabled');
    }
  
    set disabled(value) {
        this.toggleAttribute('disabled', !!value);
    }

    get active() {
        return this.hasAttribute('active');
    }

    set active(value) {
        this.toggleAttribute('active', !!value);
    }
  
    get loading() {
        return this.hasAttribute('loading');
    }
    
    set loading(value) {
        this.toggleAttribute('loading', !!value);
    }
  
    get round() {
        return this.hasAttribute('round');
    }
  
    set round(value) {
        this.toggleAttribute('round', !!value);
    }
    
    get scale() {
        return this.hasAttribute('scale');
    }
    
    set scale(value) {
        this.toggleAttribute('scale', !!value);
    }
    
    get counter() {
        return this.getAttribute('counter');
    }

    set counter(value) {
        this.setAttribute('counter', value);
    }

    get label() {
        return [...this.childNodes]
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.textContent)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    set label(value) {
        [...this.childNodes]
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .forEach(node => node.remove());

        if (value && value.trim()) {
            this.insertBefore(
                document.createTextNode(value),
                this.querySelector('[slot="icon-right"]') || null
            );
        }
    }

    hideLabel() {
        this._labelVisible = false;
        this._updateState();
    }

    showLabel() {
        this._labelVisible = true;
        this._updateState();
    }

    showLeftIcon() {
        this._leftIconVisible = true;
        this._updateState();
    }

    hideLeftIcon() {
        this._leftIconVisible = false;
        this._updateState();
    }

    showRightIcon() {
        this._rightIconVisible = true;
        this._updateState();
    }

    hideRightIcon() {
        this._rightIconVisible = false;
        this._updateState();
    }

    hideCounter() {
        this._counterVisible = false;
        this._updateState();
    }

    showCounter() {
        this._counterVisible = true;
        this._updateState();
    }

    getLeftIconElement() {
        return this._iconSlot?.assignedElements({ flatten: true })[0] || null;
    }

    getRightIconElement() {
        return this._iconRightSlot?.assignedElements({ flatten: true })[0] || null;
    }
}

customElements.define('uds-button', UdsButton);

export default UdsButton;