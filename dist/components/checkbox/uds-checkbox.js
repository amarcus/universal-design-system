const checkboxSheet = new CSSStyleSheet();
let checkboxStylesPromise = false;

let checkboxTemplate = null;
let checkboxTemplatePromise = false;

function ensureCheckboxStyles() {
    if (checkboxStylesPromise) return checkboxStylesPromise;

    checkboxStylesPromise = (async () => {
        const cssUrl = new URL('./uds-checkbox.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await checkboxSheet.replace(css);
    })();

    return checkboxStylesPromise;
}

function ensureCheckboxTemplate() {
    if (checkboxTemplatePromise) return checkboxTemplatePromise;

    checkboxTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-checkbox.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        checkboxTemplate = document.createElement('template');
        checkboxTemplate.innerHTML = templateText;
    })();

    return checkboxTemplatePromise;
}

class UdsCheckbox extends HTMLElement {
    _container = null;
    _checkbox = null;
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
        return ['type', 'variant', 'size', 'round', 'disabled', 'checked', 'indeterminate', 'scale', 'name', 'value', 'counter', 'description'];
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
            ensureCheckboxStyles(),
            ensureCheckboxTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [checkboxSheet];
        this.shadowRoot.appendChild(checkboxTemplate.content.cloneNode(true));
        
        this._container = this.shadowRoot.querySelector('.checkbox-container');
        this._checkbox = this.shadowRoot.querySelector('.input');
        this._label = this.shadowRoot.querySelector('.label');
        this._labelSlot = this.shadowRoot.querySelector('slot:not([name])');
        this._iconRight = this.shadowRoot.querySelector('.icon-right');
        this._iconRightSlot = this.shadowRoot.querySelector('slot[name="icon-right"]');
        this._counterElement = this.shadowRoot.querySelector('.counter');
        this._descriptionElement = this.shadowRoot.querySelector('.description');

        this._container.setAttribute('role', 'checkbox');

        if (this._labelSlot) {
            this._labelSlot.addEventListener('slotchange', () => this._updateState());
        }

        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._container || !this._checkbox) return;

        this._container.classList.remove('checkbox--filled', 'checkbox--outline', 'checkbox--ghost', 'checkbox--text');
        this._container.classList.add(`checkbox--${this.variant}`);

        this._container.classList.remove('checkbox--primary', 'checkbox--secondary', 'checkbox--danger');
        this._container.classList.add(`checkbox--${this.type}`);

        this._container.classList.remove('checkbox--small', 'checkbox--medium', 'checkbox--large');
        this._container.classList.add(`checkbox--${this.size}`);

        this._checkbox.disabled = this.disabled;
        this._container.toggleAttribute('disabled', this.disabled);
        this._container.setAttribute('aria-disabled', String(this.disabled));

        this._checkbox.tabIndex = -1;
        this._container.tabIndex = this.disabled ? -1 : 0;

        this._container.classList.toggle('checkbox--round', this.round);
        this._container.classList.toggle('checkbox--scale', this.scale);

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

        if (this.indeterminate) {
            this._checkbox.indeterminate = true;
            this._checkbox.checked = false;
        } else {
            this._checkbox.indeterminate = false;
            this._checkbox.checked = this.checked;
        }

        this._checkbox.name = this.getAttribute('name') ?? '';
        this._checkbox.value = this.getAttribute('value') ?? '';

        this._container.setAttribute('aria-checked', this.indeterminate ? 'mixed' : String(this.checked));
    }

    _onClick(event) {
        if (event.target === this._checkbox) return;
        
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        this.removeAttribute('indeterminate');

        const nextChecked = !this.checked;
        this.checked = nextChecked;

        this.dispatchEvent(new CustomEvent('uds-change', {
            bubbles: true,
            composed: true,
            detail: {
                checked: nextChecked,
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
  
    get indeterminate() {
        return this.hasAttribute('indeterminate');
    }
    
    set indeterminate(value) {
        this.toggleAttribute('indeterminate', !!value);
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

customElements.define('uds-checkbox', UdsCheckbox);

export { UdsCheckbox };