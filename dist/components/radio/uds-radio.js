const radioSheet = new CSSStyleSheet();
let radioStylesPromise = false;

let radioTemplate = null;
let radioTemplatePromise = false;

function ensureRadioStyles() {
    if (radioStylesPromise) return radioStylesPromise;

    radioStylesPromise = (async () => {
        const cssUrl = new URL('./uds-radio.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await radioSheet.replace(css);
    })();

    return radioStylesPromise;
}

function ensureRadioTemplate() {
    if (radioTemplatePromise) return radioTemplatePromise;

    radioTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-radio.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        radioTemplate = document.createElement('template');
        radioTemplate.innerHTML = templateText;
    })();

    return radioTemplatePromise;
}

class UdsRadio extends HTMLElement {
    _container = null;
    _radio = null;
    _label = null;
    _labelSlot = null;
    _iconRight = null;
    _iconRightSlot = null;
    _descriptionElement = null;
    _counterElement = null;

    _labelVisible = true;
    _rightIconVisible = true;
    _counterVisible = true;
    _descriptionVisible = true;

    static get observedAttributes() {
        return ['type', 'variant', 'size', 'round', 'disabled', 'checked', 'scale', 'name', 'value', 'counter', 'description'];
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
        if (!this.hasAttribute('variant')) this.variant = 'text';
        if (!this.hasAttribute('size')) this.size = 'medium';
    }

    async _render() {
        if (!this.shadowRoot || this._container) return;

        await Promise.all([
            ensureRadioStyles(),
            ensureRadioTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [radioSheet];
        this.shadowRoot.appendChild(radioTemplate.content.cloneNode(true));
        
        this._container = this.shadowRoot.querySelector('.radio-container');
        this._radio = this.shadowRoot.querySelector('.input');
        this._label = this.shadowRoot.querySelector('.label');
        this._labelSlot = this.shadowRoot.querySelector('slot:not([name])');
        this._iconRight = this.shadowRoot.querySelector('.icon-right');
        this._iconRightSlot = this.shadowRoot.querySelector('slot[name="icon-right"]');
        this._counterElement = this.shadowRoot.querySelector('.counter');
        this._descriptionElement = this.shadowRoot.querySelector('.description');

        this._container.setAttribute('role', 'radio');

        if (this._labelSlot) {
            this._labelSlot.addEventListener('slotchange', () => this._updateState());
        }

        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._container || !this._radio) return;

        this._container.classList.remove('radio--filled', 'radio--outline', 'radio--ghost', 'radio--text');
        this._container.classList.add(`radio--${this.variant}`);

        this._container.classList.remove('radio--primary', 'radio--secondary', 'radio--danger');
        this._container.classList.add(`radio--${this.type}`);

        this._container.classList.remove('radio--small', 'radio--medium', 'radio--large');
        this._container.classList.add(`radio--${this.size}`);

        this._radio.disabled = this.disabled;
        this._container.toggleAttribute('disabled', this.disabled);
        this._container.setAttribute('aria-disabled', String(this.disabled));

        this._radio.tabIndex = -1;
        this._container.tabIndex = this.disabled ? -1 : 0;

        this._container.classList.toggle('radio--round', this.round);
        this._container.classList.toggle('radio--scale', this.scale);

        const hasCounter = this.counter !== null;
        this._counterElement.textContent = hasCounter ? this.counter : '';
        this._counterElement.style.display = hasCounter && this._counterVisible ? '' : 'none';

        const hasDescription = this.description !== null;
        this._descriptionElement.textContent = hasDescription ? this.description : '';
        this._descriptionElement.style.display = hasDescription && this._descriptionVisible ? '' : 'none';

        const hasRightIcon = this._iconRightSlot?.assignedNodes({ flatten: true }).length > 0;
        this._iconRight.style.display = hasRightIcon && this._rightIconVisible ? '' : 'none';

        if (this._label && this._labelSlot) {
            const hasText = this._labelSlot.assignedNodes({ flatten: true }).some(node =>
                node.nodeType === Node.ELEMENT_NODE ||
                (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')
            );

            this._label.style.display = hasText && this._labelVisible ? '' : 'none';
        }

        this._radio.checked = this.checked;
        this._radio.name = this.getAttribute('name') ?? '';
        this._radio.value = this.getAttribute('value') ?? '';

        this._container.setAttribute('aria-checked', String(this.checked));
    }

    _onClick(event) {
        if (event.target === this._radio) return;
        
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        this.checked = true;

        this.dispatchEvent(new CustomEvent('uds-change', {
            bubbles: true,
            composed: true,
            detail: {
                checked: this.checked,
                value: this.value
            }
        }));
    }

    _onKeyDown(event) {
        if (this.disabled) return;

        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();

            this._container.classList.add('active');
            setTimeout(() => {
                this._container.classList.remove('active');
            }, 120);

            this._onClick(event);
        }
    }
  
    get type() {
        return this.getAttribute('type');
    }
    
    set type(value) {
        this.setAttribute('type', value);
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
  
    get checked() {
        return this.hasAttribute('checked');
    }
  
    set checked(value) {
        this.toggleAttribute('checked', !!value);
    }
  
    get name() {
        return this.getAttribute('name');
    }
  
    set name(value) {
        this.setAttribute('name', value);
    }
    
    get value() {
        return this.getAttribute('value');
    }
    
    set value(value) {
        this.setAttribute('value', value);
    }
    
    get variant() {
        return this.getAttribute('variant');
    }
  
    set variant(value) {
        this.setAttribute('variant', value);
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

    get description() {
        return this.getAttribute('description');
    }

    set description(value) {
        this.setAttribute('description', value);
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

    hideDescription() {
        this._descriptionVisible = false;
        this._updateState();
    }

    showDescription() {
        this._descriptionVisible = true;
        this._updateState();
    }

    getRightIconElement() {
        return this._iconRightSlot?.assignedElements({ flatten: true })[0] || null;
    }
}

customElements.define('uds-radio', UdsRadio);

export { UdsRadio };