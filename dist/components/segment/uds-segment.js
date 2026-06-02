const segmentSheet = new CSSStyleSheet();
let segmentStylesPromise = false;

let segmentTemplate = null;
let segmentTemplatePromise = false;

function ensureSegmentStyles() {
    if (segmentStylesPromise) return segmentStylesPromise;

    segmentStylesPromise = (async () => {
        const cssUrl = new URL('./uds-segment.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await segmentSheet.replace(css);
    })();

    return segmentStylesPromise;
}

function ensureSegmentTemplate() {
    if (segmentTemplatePromise) return segmentTemplatePromise;

    segmentTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-segment.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        segmentTemplate = document.createElement('template');
        segmentTemplate.innerHTML = templateText;
    })();

    return segmentTemplatePromise;
}

class UdsSegment extends HTMLElement {
    _segment = null;
    _slot = null;
    _buttons = [];
  
    static get observedAttributes() {
        return ['type', 'variant', 'size', 'round', 'value'];
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
        if (!this.shadowRoot || this._segment) return;

        await Promise.all([
            ensureSegmentStyles(),
            ensureSegmentTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [segmentSheet];
        this.shadowRoot.appendChild(segmentTemplate.content.cloneNode(true));
            
        this._segment = this.shadowRoot.querySelector('.segment');
        this._slot = this.shadowRoot.querySelector('slot');

        if (this._slot) {
            this._slot.addEventListener('slotchange', () => this._collectButtons());
        }

        this._collectButtons();
        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._segment) return;
        
        this._segment.classList.remove('segment--filled', 'segment--outline', 'segment--ghost', 'segment--text');
        this._segment.classList.add(`segment--${this.variant}`);
        
        this._segment.classList.remove('segment--primary', 'segment--secondary', 'segment--danger');
        this._segment.classList.add(`segment--${this.type}`);
        
        this._segment.classList.remove('segment--small', 'segment--medium', 'segment--large');
        this._segment.classList.add(`segment--${this.size}`);

        this._segment.classList.toggle('segment--round', this.round);

        if (!this.value && this._buttons.length > 0) {
            const firstValue = this._buttons[0].getAttribute('value') ?? '0';
            this.value = firstValue;
            return;
        }

        this._buttons.forEach((button, index) => {
            const buttonValue = button.getAttribute('value') ?? String(index);
            const isActive = buttonValue === this.value;
            const isFirst = index === 0;
            const isLast = index === this._buttons.length - 1;

            button.type = this.type;
            button.variant = this.variant;
            button.size = this.size;
            button.round = false;
            button.active = isActive;

            button.toggleAttribute('segment-first', isFirst);
            button.toggleAttribute('segment-last', isLast);

            button.setAttribute('role', 'radio');
            button.setAttribute('aria-checked', String(isActive));
        });
    }

    _collectButtons() {
        if (!this._slot) return;

        this._buttons = this._slot
            .assignedElements({ flatten: true })
            .filter(el => el.tagName.toLowerCase() === 'uds-button');

        this._updateState();
    }

    _onClick(event) {
        const path = event.composedPath();
        const clickedButton = this._buttons.find(button => path.includes(button));

        if (!clickedButton) return;

        const nextValue =
            clickedButton.getAttribute('value') ??
            String(this._buttons.indexOf(clickedButton));

        if (nextValue === this.value) return;

        this.value = nextValue;

        this.dispatchEvent(new CustomEvent('uds-change', {
            bubbles: true,
            composed: true,
            detail: { value: this.value, originalEvent: event }
        }));
    }

    get value() {
        return this.getAttribute('value');
    }

    set value(value) {
        this.setAttribute('value', value);
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

customElements.define('uds-segment', UdsSegment);

export default UdsSegment;