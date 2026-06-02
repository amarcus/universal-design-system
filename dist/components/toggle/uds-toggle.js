const toggleSheet = new CSSStyleSheet();
let toggleStylesPromise = false;

let toggleTemplate = null;
let toggleTemplatePromise = false;

function ensureToggleStyles() {
    if (toggleStylesPromise) return toggleStylesPromise;

    toggleStylesPromise = (async () => {
        const cssUrl = new URL('./uds-toggle.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await toggleSheet.replace(css);
    })();

    return toggleStylesPromise;
}

function ensureToggleTemplate() {
    if (toggleTemplatePromise) return toggleTemplatePromise;

    toggleTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-toggle.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        toggleTemplate = document.createElement('template');
        toggleTemplate.innerHTML = templateText;
    })();

    return toggleTemplatePromise;
}

class UdsToggle extends HTMLElement {
    _toggle = null;
    _input = null;
    _label = null;
    _iconRight = null;
    _labelSlot = null;
    _iconRightSlot = null;
    _counterElement = null;
    _description = null;

    _labelVisible = true;
    _rightIconVisible = true;
    _counterVisible = true;
    _descriptionVisible = true;
  
    static get observedAttributes() {
        return ['round', 'disabled', 'scale', 'counter', 'description'];
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
        if (!this.hasAttribute('size')) this.size = 'medium';
    }

    async _render() {
        if (!this.shadowRoot || this._toggle) return;

        await Promise.all([
            ensureToggleStyles(),
            ensureToggleTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [toggleSheet];
        this.shadowRoot.appendChild(toggleTemplate.content.cloneNode(true));
            
        this._toggle = this.shadowRoot.querySelector('.toggle');
        this._input = this.shadowRoot.querySelector('.input');
        this._label = this.shadowRoot.querySelector('.label');
        this._iconRight = this.shadowRoot.querySelector('.icon-right');
        this._labelSlot = this.shadowRoot.querySelector('slot:not([name])');
        this._iconRightSlot = this.shadowRoot.querySelector('slot[name="icon-right"]');
        this._counterElement = this.shadowRoot.querySelector('.counter');
        this._description = this.shadowRoot.querySelector('.description');

        if (this._labelSlot) {
            this._labelSlot.addEventListener('slotchange', () => this._updateState());
        }

        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._toggle) return;
        
        if (this._input) {
            this._input.disabled = this.disabled;
            this._input.tabIndex = this.disabled ? -1 : 0;
            this._input.setAttribute('aria-disabled', String(this.disabled));
        }

        this._toggle.classList.remove('toggle--small', 'toggle--medium', 'toggle--large');
        this._toggle.classList.add(`toggle--${this.size}`);

        this._toggle.setAttribute('aria-disabled', String(this.disabled));
        this._toggle.classList.toggle('toggle--scale', this.scale);

        const hasCounter = this.counter !== null;
        this._counterElement.textContent = hasCounter ? this.counter : '';
        this._counterElement.style.display = hasCounter && this._counterVisible ? '' : 'none';

        const hasRightIcon = this._iconRightSlot?.assignedNodes({ flatten: true }).length > 0;
        this._iconRight.style.display = hasRightIcon && this._rightIconVisible ? '' : 'none';

        const hasDescription = this.description !== null && this.description.trim() !== '';

        this._description.textContent = hasDescription ? this.description : '';
        this._description.style.display = hasDescription && this._descriptionVisible ? '' : 'none';

        if (this._label && this._labelSlot) {
            const hasText = this._labelSlot.assignedNodes({ flatten: true }).some(node =>
                node.nodeType === Node.ELEMENT_NODE ||
                (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')
            );

            this._label.style.display = hasText && this._labelVisible ? '' : 'none';
        }
    }

    _onClick(event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
    }

    _onKeyDown(event) {
        if (this.disabled) return;

        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            this._toggle.classList.add('active');
            this.click();

            setTimeout(() => {
                if (!this.hasAttribute('active')) {
                    this._toggle.classList.remove('active');
                }
            }, 120);
        }
    }
  
    get disabled() {
        return this.hasAttribute('disabled');
    }
  
    set disabled(value) {
        this.toggleAttribute('disabled', value);
    }

    get scale() {
        return this.hasAttribute('scale');
    }

    set scale(value) {
        this.toggleAttribute('scale', value);
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

    get description() {
        return this.getAttribute('description');
    }

    set description(value) {
        if (value == null || value === '') {
            this.removeAttribute('description');
        } else {
            this.setAttribute('description', value);
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
  
    get size() {
        return this.getAttribute('size');
    }
  
    set size(value) {
        this.setAttribute('size', value);
    }
}

customElements.define('uds-toggle', UdsToggle);

export default UdsToggle;