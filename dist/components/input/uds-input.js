const inputSheet = new CSSStyleSheet();
let inputStylesPromise = false;

let inputTemplate = null;
let inputTemplatePromise = false;

function ensureInputStyles() {
    if (inputStylesPromise) return inputStylesPromise;

    inputStylesPromise = (async () => {
        const cssUrl = new URL('./uds-input.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await inputSheet.replace(css);
    })();

    return inputStylesPromise;
}

function ensureInputTemplate() {
    if (inputTemplatePromise) return inputTemplatePromise;

    inputTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-input.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        inputTemplate = document.createElement('template');
        inputTemplate.innerHTML = templateText;
    })();

    return inputTemplatePromise;
}

class UdsInput extends HTMLElement {
    _container = null;
    _input = null;
    _icon = null;
    _iconSlot = null;
    _buttonSlot = null;
    _clearButton = null;
    _clearButtonSlot = null;
    _counterElement = null;
    _descriptionElement = null;
    _suffix = null;

    _leftIconVisible = true;
    _rightButtonVisible = true;
    _clearButtonVisible = true;
    _counterVisible = true;
    _descriptionVisible = true;
    
    static get observedAttributes() {
        return [ 'type', 'variant', 'scale', 'name', 'value', 'placeholder', 'disabled', 'readonly', 'size', 'maxlength', 'minlength', 'required', 'multiline', 'resizer', 'counter', 'description', 'round', 'input-type' ];
    }

    constructor() {
        super();

        this._onInput = this._onInput.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
        this._onClear = this._onClear.bind(this);
        this._onIconSlotChange = this._onIconSlotChange.bind(this);
        this._onSuffixSlotsChange = this._onSuffixSlotsChange.bind(this);
        
        this.attachShadow({ mode: 'open' });

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

        this._input?.addEventListener('input', this._onInput);
        this._input?.addEventListener('focus', this._onFocus);
        this._input?.addEventListener('blur', this._onBlur);

        this._textarea?.addEventListener('input', this._onInput);
        this._textarea?.addEventListener('focus', this._onFocus);
        this._textarea?.addEventListener('blur', this._onBlur);
        
        this._clearButton?.addEventListener('click', this._onClear);
        this._iconSlot?.addEventListener('slotchange', this._onIconSlotChange);
        this._buttonSlot?.addEventListener('slotchange', this._onSuffixSlotsChange);
        this._clearButtonSlot?.addEventListener('slotchange', this._onSuffixSlotsChange);

        this._resizer?.addEventListener('mousedown', this._boundResizerHandler);

        this._suffixResizeObserver = new ResizeObserver(() => {
            this._updateSuffixWidth();
        });

        if (this._suffix) {
            this._suffixResizeObserver.observe(this._suffix);
        }

        const observeAssigned = (slot) => {
            if (!slot) return;

            slot.assignedElements().forEach(el => {
                this._suffixResizeObserver.observe(el);
            });
        };

        observeAssigned(this._buttonSlot);
        observeAssigned(this._clearButtonSlot);

        if (this._counterElement) {
            this._suffixResizeObserver.observe(this._counterElement);
        }
    }

    disconnectedCallback() {
        this._input?.removeEventListener('input', this._onInput);
        this._input?.removeEventListener('focus', this._onFocus);
        this._input?.removeEventListener('blur', this._onBlur);

        this._textarea?.removeEventListener('input', this._onInput);
        this._textarea?.removeEventListener('focus', this._onFocus);
        this._textarea?.removeEventListener('blur', this._onBlur);
        
        this._clearButton?.removeEventListener('click', this._onClear);
        this._iconSlot?.removeEventListener('slotchange', this._onIconSlotChange);
        this._buttonSlot?.removeEventListener('slotchange', this._onSuffixSlotsChange);
        this._clearButtonSlot?.removeEventListener('slotchange', this._onSuffixSlotsChange);

        this._resizer?.removeEventListener('mousedown', this._boundResizerHandler);

        this._suffixResizeObserver?.disconnect();
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
        if (!this.hasAttribute('type')) this.type = 'secondary';
        if (!this.hasAttribute('variant')) this.variant = 'filled';
        if (!this.hasAttribute('size')) this.size = 'medium';
    }

    async _render() {
        if (!this.shadowRoot || this._container) return;

        await Promise.all([
            ensureInputStyles(),
            ensureInputTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [inputSheet];
        this.shadowRoot.appendChild(inputTemplate.content.cloneNode(true));
        
        this._input = this.shadowRoot.querySelector('.input');
        this._container = this.shadowRoot.querySelector('.input-container');
        this._textarea = this.shadowRoot.querySelector('.textarea');
        this._icon = this.shadowRoot.querySelector('.icon');
        this._iconSlot = this.shadowRoot.querySelector('slot[name="icon"]');
        this._button = this.shadowRoot.querySelector('.button');
        this._buttonSlot = this.shadowRoot.querySelector('slot[name="button"]');
        this._clearButton = this.shadowRoot.querySelector('.clear-button');
        this._clearButtonSlot = this.shadowRoot.querySelector('slot[name="clear-button"]');
        this._counterElement = this.shadowRoot.querySelector('.counter');
        this._descriptionElement = this.shadowRoot.querySelector('.description');
        this._resizer = this.shadowRoot.querySelector('.resizer');
        this._suffix = this.shadowRoot.querySelector('.suffix');
        
        this._boundResizerHandler = this._onResizerMouseDown.bind(this);

        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._container || (!this._input && !this._textarea)) return;

        this._container.classList.remove('input--filled', 'input--outline', 'input--ghost', 'input--text');
        this._container.classList.add(`input--${this.variant}`);

        this._container.classList.remove('input--primary', 'input--secondary', 'input--danger');
        this._container.classList.add(`input--${this.type}`);

        this._container.classList.remove('input--small', 'input--medium', 'input--large');
        this._container.classList.add(`input--${this.size}`);

        this._input.disabled = this.disabled;
        this._textarea.disabled = this.disabled;
        this._container.toggleAttribute('disabled', this.disabled);
        this._container.setAttribute('aria-disabled', String(this.disabled));

        this._input.readOnly = this.readonly;
        this._textarea.readOnly = this.readonly;

        this._input.type = this.inputType; // text, password, email, etc

        this._input.placeholder = this.placeholder || '';
        this._textarea.placeholder = this.placeholder || '';

        this._container.classList.toggle('input--round', this.round);
        this._container.classList.toggle('input--scale', this.scale);

        const hasLeftIcon = this._iconSlot?.assignedNodes({ flatten: true }).length > 0;
        this._icon.style.display = hasLeftIcon && this._leftIconVisible ? '' : 'none';

        const hasButton = this._buttonSlot?.assignedNodes({ flatten: true }).length > 0;
        this._button.style.display = hasButton && this._rightButtonVisible ? '' : 'none';

        const hasClearButton = this._clearButtonSlot?.assignedNodes({ flatten: true }).length > 0;
        this._clearButton.style.display = hasClearButton && this._clearButtonVisible ? '' : 'none';

        const hasCounter = this.counter !== null;
        this._counterElement.textContent = hasCounter ? this.counter : '';
        this._counterElement.style.display = hasCounter && this._counterVisible ? '' : 'none';

        const hasDescription = this.description !== null;
        this._descriptionElement.textContent = hasDescription ? this.description : '';
        this._descriptionElement.style.display = hasDescription && this._descriptionVisible ? '' : 'none';

        const isMultiline = this.hasAttribute('multiline');
        this._input.style.display = isMultiline ? 'none' : 'block';
        this._textarea.style.display = isMultiline ? 'block' : 'none';

        this._input.name = this.getAttribute('name') ?? '';
        this._textarea.name = this.getAttribute('name') ?? '';

        const attrValue = this.getAttribute('value');

        if (attrValue !== null) {
            if (this._input.value !== attrValue) {
                this._input.value = attrValue;
            }

            if (this._textarea.value !== attrValue) {
                this._textarea.value = attrValue;
            }
        }

        if (this.maxlength == null) {
            this._input.removeAttribute('maxlength');
            this._textarea.removeAttribute('maxlength');
        } else {
            this._input.maxLength = Number(this.maxlength);
            this._textarea.maxLength = Number(this.maxlength);
        }

        if (this.minlength == null) {
            this._input.removeAttribute('minlength');
            this._textarea.removeAttribute('minlength');
        } else {
            this._input.minLength = Number(this.minlength);
            this._textarea.minLength = Number(this.minlength);
        }

        this._input.required = this.required;
        this._textarea.required = this.required;

        if (this._resizer) {
            this._resizer.style.display = this.hasAttribute('resizer') ? '' : 'none';
        }

        this._onIconSlotChange();
        this._onSuffixSlotsChange();
    }

    _updateSize() {
        // ??
    }
  
    _onInput(event) {
        this.value = event.target.value;
        this.dispatchEvent(new CustomEvent('input', {
            bubbles: true,
            composed: true,
            detail: { value: this.value }
        }));
    }

    _onFocus(event) {
        this.dispatchEvent(new CustomEvent('focus', {
            bubbles: true,
            composed: true
        }));
    }

    _onBlur(event) {    
        this.dispatchEvent(new CustomEvent('blur', {
            bubbles: true,
            composed: true
        }));
    }

    _onClear(event) {
        this.value = '';
        this._input.value = '';
        this._textarea.value = '';
        
        this.hasAttribute('multiline') ? this._textarea.focus() : this._input.focus();

        this.dispatchEvent(new CustomEvent('clear', {
            bubbles: true,
            composed: true
        }));

        this.dispatchEvent(new CustomEvent('input', {
            bubbles: true,
            composed: true,
            detail: { value: this.value }
        }));
    }
  
    _onResizerMouseDown(event) {
        event.preventDefault();
        
        const startY = event.clientY;
        const startHeight = this._textarea.offsetHeight;
        
        const onMouseMove = (moveEvent) => {
            const deltaY = moveEvent.clientY - startY;
            this._textarea.style.height = `${startHeight + deltaY}px`;
        };
        
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    _onIconSlotChange() {
        if (!this._container || !this._iconSlot) return;
        
        const hasIcon = this._iconSlot.assignedElements().length > 0 && this._leftIconVisible;
        
        this._container.classList.toggle('has-icon', hasIcon);
    }

    _onSuffixSlotsChange() {
        const hasAnySlot = this._buttonSlot || this._clearButtonSlot;

        if (!this._container || !hasAnySlot) return;

        const hasButton = this._buttonSlot.assignedElements().length > 0 && this._rightButtonVisible;
        const hasClearButton = this._clearButtonSlot.assignedElements().length > 0 && this._clearButtonVisible;
        const hasCounter = this.hasAttribute('counter') && this._counterVisible;
        const hasSuffix = hasButton || hasClearButton || hasCounter;

        this._container.classList.toggle('has-suffix', hasSuffix);
        this._container.classList.toggle('has-button', hasButton);
        this._container.classList.toggle('has-clear-button', hasClearButton);
        this._container.classList.toggle('has-counter', hasCounter);

        if (this._suffixResizeObserver) {
            this._suffixResizeObserver.disconnect();

            if (this._suffix) {
                this._suffixResizeObserver.observe(this._suffix);
            }

            const observeAssigned = (slot) => {
                if (!slot) return;

                slot.assignedElements().forEach(el => {
                    this._suffixResizeObserver.observe(el);
                });
            };

            observeAssigned(this._buttonSlot);
            observeAssigned(this._clearButtonSlot);

            const counterElement = this.shadowRoot.querySelector('.counter');

            if (counterElement) {
                this._suffixResizeObserver.observe(counterElement);
            }
        }

        this._updateSuffixWidth();
    }

    _updateSuffixWidth() {
        const suffix = this._suffix;
        const width = suffix ? Math.ceil(suffix.getBoundingClientRect().width) : 0;

        this.style.setProperty('--suffix-width', `${width}px`);
    }

    get type() {
        return this.getAttribute('type');
    }
    
    set type(value) {
        this.setAttribute('type', value);
    }
    
    get placeholder() {
        return this.getAttribute('placeholder');
    }
    
    set placeholder(value) {
        this.setAttribute('placeholder', value);
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

    get description() {
        return this.getAttribute('description');
    }

    set description(value) {
        this.setAttribute('description', value);
    }
  
    get disabled() {
        return this.hasAttribute('disabled');
    }
  
    set disabled(value) {
        this.toggleAttribute('disabled', !!value);
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
  
    get readonly() {
        return this.hasAttribute('readonly');
    }
  
    set readonly(value) {
        this.toggleAttribute('readonly', !!value);
    }
  
    get size() {
        return this.getAttribute('size');
    }
    
    set size(value) {
        this.setAttribute('size', value);
    }
    
    get maxlength() {
        return this.getAttribute('maxlength');
    }
  
    set maxlength(value) {
        value == null ? this.removeAttribute('maxlength') : this.setAttribute('maxlength', value);
    }
  
    get minlength() {
        return this.getAttribute('minlength');
    }
  
    set minlength(value) {
        value == null ? this.removeAttribute('minlength') : this.setAttribute('minlength', value);
    }
  
    get required() {
        return this.hasAttribute('required');
    }
  
    set required(value) {
        this.toggleAttribute('required', !!value);
    }

    get counter() {
        return this.getAttribute('counter');
    }

    set counter(value) {
        this.setAttribute('counter', value);
    }

    get inputType() {
        return this.getAttribute('input-type') || 'text';
    }

    set inputType(value) {
        this.setAttribute('input-type', value);
    }

    showLeftIcon() {
        this._leftIconVisible = true;
        this._updateState();
    }

    hideLeftIcon() {
        this._leftIconVisible = false;
        this._updateState();
    }

    showRightButton() {
        this._rightButtonVisible = true;
        this._updateState();
    }

    hideRightButton() {
        this._rightButtonVisible = false;
        this._updateState();
    }

    showClearButton() {
        this._clearButtonVisible = true;
        this._updateState();
    }

    hideClearButton() {
        this._clearButtonVisible = false;
        this._updateState();
    }

    showCounter() {
        this._counterVisible = true;
        this._updateState();
    }

    hideCounter() {
        this._counterVisible = false;
        this._updateState();
    }

    showDescription() {
        this._descriptionVisible = true;
        this._updateState();
    }

    hideDescription() {
        this._descriptionVisible = false;
        this._updateState();
    }

    getLeftIconElement() {
        return this._iconSlot?.assignedElements({ flatten: true })[0] || null;
    }

    getRightButtonElement() {
        return this._buttonSlot?.assignedElements({ flatten: true })[0] || null;
    }

    getClearButtonElement() {
        return this._clearButtonSlot?.assignedElements({ flatten: true })[0] || null;
    }
}

customElements.define('uds-input', UdsInput);

export default UdsInput;