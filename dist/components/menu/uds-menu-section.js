const menuSectionSheet = new CSSStyleSheet();
let menuSectionStylesPromise = false;

let menuSectionTemplate = null;
let menuSectionTemplatePromise = false;

function ensureMenuSectionStyles() {
    if (menuSectionStylesPromise) return menuSectionStylesPromise;

    menuSectionStylesPromise = (async () => {
        const cssUrl = new URL('./uds-menu-section.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await menuSectionSheet.replace(css);
    })();

    return menuSectionStylesPromise;
}

function ensureMenuSectionTemplate() {
    if (menuSectionTemplatePromise) return menuSectionTemplatePromise;

    menuSectionTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-menu-section.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        menuSectionTemplate = document.createElement('template');
        menuSectionTemplate.innerHTML = templateText;
    })();

    return menuSectionTemplatePromise;
}

class UdsMenuSection extends HTMLElement {
    _section = null;
    _label = null;
    _items = null;
    _itemsSlot = null;

    _labelVisible = true;
    _dividerVisible = true;

    static get observedAttributes() {
        return ['type', 'section-type', 'exclusive', 'label'];
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
        if (!this.shadowRoot || this._section) return;

        await Promise.all([
            ensureMenuSectionStyles(),
            ensureMenuSectionTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [menuSectionSheet];
        this.shadowRoot.appendChild(menuSectionTemplate.content.cloneNode(true));

        this._section = this.shadowRoot.querySelector('.menu-section');
        this._label = this.shadowRoot.querySelector('.label');
        this._items = this.shadowRoot.querySelector('.items');
        this._itemsSlot = this.shadowRoot.querySelector('slot:not([name])');

        this._itemsSlot?.addEventListener('slotchange', () => this._updateState());

        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._section) return;

        this._section.classList.remove('menu-section--actions', 'menu-section--options');
        this._section.classList.add(`menu-section--${this.sectionType}`);

        const hasLabel = this.label !== null && this.label !== '';
        this._label.textContent = hasLabel ? this.label : '';
        this._label.style.display = hasLabel && this._labelVisible ? '' : 'none';

        if (this._items && this._itemsSlot) {
            const hasItems = this._itemsSlot.assignedElements({ flatten: true }).length > 0;
            this._items.style.display = hasItems ? '' : 'none';
        }

        const items = this.querySelectorAll('uds-menu-item');

        items.forEach(item => {
            item.setAttribute('section-type', this.sectionType);
            item._updateState?.();
        });
    }

    _onClick(event) {
        if (this.sectionType !== 'options') return;

        const items = this.querySelectorAll('uds-menu-item');
        const clickedItem = [...items].find(item => event.composedPath().includes(item));

        if (!clickedItem) return;

        if (this.exclusive) {
            items.forEach(item => {
                item.selected = item === clickedItem;
            });
        } else {
            clickedItem.selected = !clickedItem.selected;
        }

        this.dispatchEvent(new CustomEvent('uds-change', {
            bubbles: true,
            composed: true,
            detail: {
                value: clickedItem.value ?? null,
                selected: clickedItem.selected,
                exclusive: this.exclusive
            }
        }));
    }

    get label() {
        return this.getAttribute('label');
    }

    set label(value) {
        this.setAttribute('label', value);
    }

    get type() {
        return this.getAttribute('type') || this.closest('uds-menu')?.type || 'secondary';
    }

    set type(value) {
        this.setAttribute('type', value);
    }

    get sectionType() {
        return this.getAttribute('section-type') || 'actions';
    }

    get exclusive() {
        return this.hasAttribute('exclusive');
    }

    set exclusive(value) {
        this.toggleAttribute('exclusive', !!value);
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

customElements.define('uds-menu-section', UdsMenuSection);

export default UdsMenuSection;