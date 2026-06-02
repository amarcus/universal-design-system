const fieldSheet = new CSSStyleSheet();
let fieldStylesPromise = false;

let fieldTemplate = null;
let fieldTemplatePromise = false;

const groupSheet = new CSSStyleSheet();
let groupStylesPromise = false;

let groupTemplate = null;
let groupTemplatePromise = false;

const formSheet = new CSSStyleSheet();
let formStylesPromise = false;

let formTemplate = null;
let formTemplatePromise = false;

function ensureFieldStyles() {
    if (fieldStylesPromise) return fieldStylesPromise;

    fieldStylesPromise = (async () => {
        const cssUrl = new URL('./uds-field.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await fieldSheet.replace(css);
    })();

    return fieldStylesPromise;
}

function ensureFieldTemplate() {
    if (fieldTemplatePromise) return fieldTemplatePromise;

    fieldTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-field.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        fieldTemplate = document.createElement('template');
        fieldTemplate.innerHTML = templateText;
    })();

    return fieldTemplatePromise;
}

function ensureFormStyles() {
    if (formStylesPromise) return formStylesPromise;

    formStylesPromise = (async () => {
        const cssUrl = new URL('./uds-form.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await formSheet.replace(css);
    })();

    return formStylesPromise;
}

function ensureGroupStyles() {
    if (groupStylesPromise) return groupStylesPromise;

    groupStylesPromise = (async () => {
        const cssUrl = new URL('./uds-form-group.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await groupSheet.replace(css);
    })();

    return groupStylesPromise;
}

function ensureGroupTemplate() {
    if (groupTemplatePromise) return groupTemplatePromise;

    groupTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-form-group.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        groupTemplate = document.createElement('template');
        groupTemplate.innerHTML = templateText;
    })();

    return groupTemplatePromise;
}

function ensureFormTemplate() {
    if (formTemplatePromise) return formTemplatePromise;

    formTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-form.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        formTemplate = document.createElement('template');
        formTemplate.innerHTML = templateText;
    })();

    return formTemplatePromise;
}

function hasSlotContent(slot) {
    if (!slot) return false;

    return slot.assignedNodes({ flatten: true }).some(node =>
        node.nodeType === Node.ELEMENT_NODE ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')
    );
}

class UdsField extends HTMLElement {
    _field = null;
    _label = null;
    _labelIcon = null;
    _control = null;
    _description = null;

    _labelSlot = null;
    _labelIconSlot = null;
    _controlSlot = null;
    _descriptionSlot = null;

    _labelVisible = true;
    _labelIconVisible = true;
    _descriptionVisible = true;

    static get observedAttributes() {
        return ['disabled'];
    }

    constructor() {
        super();

        this._onSlotChange = this._onSlotChange.bind(this);
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
    }

    disconnectedCallback() {
        this._labelSlot?.removeEventListener('slotchange', this._onSlotChange);
        this._controlSlot?.removeEventListener('slotchange', this._onSlotChange);
        this._descriptionSlot?.removeEventListener('slotchange', this._onSlotChange);
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

    _updateControlType() {
        const control = this.getControlElement();
        if (!control || !this._field) return;

        this._field.classList.remove(
            'input',
            'checkbox',
            'checkbox-group',
            'radio-group',
            'segment',
            'toggle-button',
            'toggle',
            'button',
        );

        const tag = control.tagName.toLowerCase();

        this._field.classList.add(`field-${tag.replace('uds-', '')}`);
    }

    _initDefaults() {

    }

    async _render() {
        if (!this.shadowRoot || this._field) return;

        await Promise.all([
            ensureFieldStyles(),
            ensureFieldTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [fieldSheet];
        this.shadowRoot.appendChild(fieldTemplate.content.cloneNode(true));

        this._field = this.shadowRoot.querySelector('.field');
        this._label = this.shadowRoot.querySelector('.label');
        this._labelIcon = this.shadowRoot.querySelector('.label-icon');
        this._control = this.shadowRoot.querySelector('.control');
        this._description = this.shadowRoot.querySelector('.description');

        this._labelSlot = this.shadowRoot.querySelector('slot[name="label"]');
        this._labelIconSlot = this.shadowRoot.querySelector('slot[name="label-icon"]');
        this._controlSlot = this.shadowRoot.querySelector('slot:not([name])');
        this._descriptionSlot = this.shadowRoot.querySelector('slot[name="description"]');

        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._field) return;

        this._field.classList.toggle('disabled', this.disabled);
        this._field.setAttribute('aria-disabled', String(this.disabled));

        const hasLabel = hasSlotContent(this._labelSlot);
        const hasDescription = hasSlotContent(this._descriptionSlot);

        const hasLabelIcon = this._labelIconSlot?.assignedNodes({ flatten: true }).length > 0;
        this._labelIcon.style.display = hasLabelIcon && this._labelIconVisible ? '' : 'none';

        if (this._label) {
            this._label.style.display = hasLabel && this._labelVisible ? '' : 'none';
        }

        if (this._description) {
            this._description.style.display = hasDescription && this._descriptionVisible ? '' : 'none';
        }

        this._updateControlType();
    }

    _onSlotChange() {
        this._updateState();
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }

    set disabled(value) {
        this.toggleAttribute('disabled', Boolean(value));
    }

    hideLabel() {
        this._labelVisible = false;
        this._updateState();
    }

    showLabel() {
        this._labelVisible = true;
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

    getLabelElement() {
        return this._labelSlot?.assignedElements({ flatten: true })[0] || null;
    }

    getControlElement() {
        return this._controlSlot?.assignedElements({ flatten: true })[0] || null;
    }

    getDescriptionElement() {
        return this._descriptionSlot?.assignedElements({ flatten: true })[0] || null;
    }
}



class UdsGroup extends HTMLElement {
    _group = null;
    _title = null;
    _description = null;
    _fields = null;

    _titleSlot = null;
    _descriptionSlot = null;
    _defaultSlot = null;

    _titleVisible = true;
    _descriptionVisible = true;

    constructor() {
        super();

        this._onSlotChange = this._onSlotChange.bind(this);
        this.attachShadow({ mode: 'open' });

        this.ready = new Promise(resolve => {
            this._resolveReady = resolve;
        });
    }

    async connectedCallback() {
        await this._render();
    }

    disconnectedCallback() {
        this._titleSlot?.removeEventListener('slotchange', this._onSlotChange);
        this._descriptionSlot?.removeEventListener('slotchange', this._onSlotChange);
        this._defaultSlot?.removeEventListener('slotchange', this._onSlotChange);
    }

    async _render() {
        if (!this.shadowRoot || this._group) return;

        await Promise.all([
            ensureGroupStyles(),
            ensureGroupTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [groupSheet];
        this.shadowRoot.appendChild(groupTemplate.content.cloneNode(true));

        this._group = this.shadowRoot.querySelector('.group');
        this._title = this.shadowRoot.querySelector('.title');
        this._description = this.shadowRoot.querySelector('.description');
        this._fields = this.shadowRoot.querySelector('.fields');

        this._titleSlot = this.shadowRoot.querySelector('slot[name="title"]');
        this._descriptionSlot = this.shadowRoot.querySelector('slot[name="description"]');
        this._defaultSlot = this.shadowRoot.querySelector('slot:not([name])');

        this._titleSlot?.addEventListener('slotchange', this._onSlotChange);
        this._descriptionSlot?.addEventListener('slotchange', this._onSlotChange);
        this._defaultSlot?.addEventListener('slotchange', this._onSlotChange);

        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._group) return;

        const hasTitle = hasSlotContent(this._titleSlot);
        const hasDescription = hasSlotContent(this._descriptionSlot);

        if (this._title) {
            this._title.style.display = hasTitle && this._titleVisible ? '' : 'none';
        }

        if (this._description) {
            this._description.style.display = hasDescription && this._descriptionVisible ? '' : 'none';
        }
    }

    _onSlotChange() {
        this._updateState();
    }

    hideTitle() {
        this._titleVisible = false;
        this._updateState();
    }

    showTitle() {
        this._titleVisible = true;
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

    getTitleElement() {
        return this._titleSlot?.assignedElements({ flatten: true })[0] || null;
    }

    getDescriptionElement() {
        return this._descriptionSlot?.assignedElements({ flatten: true })[0] || null;
    }

    getFields() {
        return this._defaultSlot
            ?.assignedElements({ flatten: true })
            .filter(el => el.tagName.toLowerCase() === 'uds-field') || [];
    }
}



class UdsForm extends HTMLElement {
    _form = null;
    _slot = null;
    _fields = [];

    static get observedAttributes() {
        return ['disabled'];
    }

    constructor() {
        super();

        this._onSlotChange = this._collectFields.bind(this);
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
    }

    disconnectedCallback() {
        this._slot?.removeEventListener('slotchange', this._onSlotChange);
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

    }

    async _render() {
        if (!this.shadowRoot || this._form) return;

        await Promise.all([
            ensureFormStyles(),
            ensureFormTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [formSheet];
        this.shadowRoot.appendChild(formTemplate.content.cloneNode(true));

        this._form = this.shadowRoot.querySelector('.form');
        this._slot = this.shadowRoot.querySelector('slot');

        if (this._slot) {
            this._slot.addEventListener('slotchange', this._onSlotChange);
        }

        this._collectFields();
        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._form) return;

        this._form.classList.toggle('disabled', this.disabled);
        this._form.setAttribute('aria-disabled', String(this.disabled));

        this._fields.forEach(field => {
            field.disabled = this.disabled || field.hasAttribute('disabled');
        });
    }

    _collectFields() {
        if (!this._slot) return;

        this._fields = this._slot
            .assignedElements({ flatten: true })
            .filter(el => el.tagName.toLowerCase() === 'uds-field');

        this._updateState();
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }

    set disabled(value) {
        this.toggleAttribute('disabled', Boolean(value));
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
                this.querySelector('[slot="label-icon"]') || null
            );
        }
    }

    showLabelIcon() {
        this._labelIconVisible = true;
        this._updateState();
    }

    hideLabelIcon() {
        this._labelIconVisible = false;
        this._updateState();
    }

    getLabelIconElement() {
        return this._labelIconSlot?.assignedElements({ flatten: true })[0] || null;
    }

    getFields() {
        return this._fields;
    }
}

customElements.define('uds-field', UdsField);
customElements.define('uds-form-group', UdsGroup);
customElements.define('uds-form', UdsForm);

export default UdsForm;
export { UdsField };