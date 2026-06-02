const listSectionSheet = new CSSStyleSheet();
let listSectionStylesPromise = false;

let listSectionTemplate = null;
let listSectionTemplatePromise = false;

function ensureListSectionStyles() {
    if (listSectionStylesPromise) return listSectionStylesPromise;

    listSectionStylesPromise = (async () => {
        const cssUrl = new URL('./uds-list-section.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await listSectionSheet.replace(css);
    })();

    return listSectionStylesPromise;
}

function ensureListSectionTemplate() {
    if (listSectionTemplatePromise) return listSectionTemplatePromise;

    listSectionTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-list-section.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        listSectionTemplate = document.createElement('template');
        listSectionTemplate.innerHTML = templateText;
    })();

    return listSectionTemplatePromise;
}

class UdsListSection extends HTMLElement {
    _section = null;
    _label = null;
    _items = null;
    _itemsSlot = null;

    _labelVisible = true;
    _dividerVisible = true;

    static get observedAttributes() {
        return ['type', 'label', 'checkmark', 'sortable'];
    }

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.ready = new Promise(resolve => {
            this._resolveReady = resolve;
        });

        this._onClick = this._onClick.bind(this);
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

    attributeChangedCallback(name, oldValue, newValue) {
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
        //
    }

    async _render() {
        if (!this.shadowRoot || this._section) return;

        await Promise.all([
            ensureListSectionStyles(),
            ensureListSectionTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [listSectionSheet];
        this.shadowRoot.appendChild(listSectionTemplate.content.cloneNode(true));

        this._section = this.shadowRoot.querySelector('.list-section');
        this._label = this.shadowRoot.querySelector('.label');
        this._items = this.shadowRoot.querySelector('.items');
        this._itemsSlot = this.shadowRoot.querySelector('slot:not([name])');

        this._itemsSlot?.addEventListener('slotchange', () => this._updateState());

        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._section) return;

        const hasLabel = this.label !== null && this.label !== '';
        this._label.textContent = hasLabel ? this.label : '';
        this._label.style.display = hasLabel && this._labelVisible ? '' : 'none';

        if (this._items && this._itemsSlot) {
            const hasItems = this._itemsSlot.assignedElements({ flatten: true }).length > 0;
            this._items.style.display = hasItems ? '' : 'none';
        }

        const items = this.querySelectorAll('uds-list-item');

        items.forEach(item => {
            item._updateState?.();

            if (this.checkmark === 'none') {
                item.hideCheckmark();
            } else {
                item.showCheckmark();
            }

            if (this.sortable) {
                item.showDragger();
            } else {
                item.hideDragger();
            }
        });
    }

    _onClick(event) {
        const items = this.querySelectorAll('uds-list-item');
        const clickedItem = [...items].find(item => event.composedPath().includes(item));

        if (!clickedItem) return;

        const currentList = this.closest('uds-list');
        const list = currentList?._getRootList?.() || currentList;

        if (list?.selectItem) {
            list.selectItem(clickedItem);
        } else {
            items.forEach(item => {
                item.selected = item === clickedItem;
            });
        }

        this.dispatchEvent(new CustomEvent('uds-change', {
            bubbles: true,
            composed: true,
            detail: {
                value: clickedItem.value ?? null,
                selected: clickedItem.selected,
                multiple: list?.multiple ?? false
            }
        }));
    }

    get checkmark() {
        return this.getAttribute('checkmark');
    }

    set checkmark(value) {
        value == null ? this.removeAttribute('checkmark') : this.setAttribute('checkmark', value);
    }

    get sortable() {
        return this.hasAttribute('sortable');
    }

    set sortable(value) {
        this.toggleAttribute('sortable', !!value);
    }

    get label() {
        return this.getAttribute('label');
    }

    set label(value) {
        this.setAttribute('label', value);
    }

    get type() {
        return this.getAttribute('type') || this.closest('uds-list')?.type || 'primary';
    }

    set type(value) {
        this.setAttribute('type', value);
    }

    showLabel() {
        this._labelVisible = true;
        this._updateState();
    }

    hideLabel() {
        this._labelVisible = false;
        this._updateState();
    }

    hideDivider() {
        this._dividerVisible = false;
        this.toggleAttribute('no-divider', true);
    }

    showDivider() {
        this._dividerVisible = true;
        this.toggleAttribute('no-divider', false);
    }
}

customElements.define('uds-list-section', UdsListSection);

export default UdsListSection;