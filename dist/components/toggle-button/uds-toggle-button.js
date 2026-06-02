const toggleButtonSheet = new CSSStyleSheet();
let toggleButtonStylesPromise = false;

let toggleButtonTemplate = null;
let toggleButtonTemplatePromise = false;

function ensureToggleButtonStyles() {
    if (toggleButtonStylesPromise) return toggleButtonStylesPromise;

    toggleButtonStylesPromise = (async () => {
        const cssUrl = new URL('./uds-toggle-button.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await toggleButtonSheet.replace(css);
    })();

    return toggleButtonStylesPromise;
}

function ensureToggleButtonTemplate() {
    if (toggleButtonTemplatePromise) return toggleButtonTemplatePromise;

    toggleButtonTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-toggle-button.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        toggleButtonTemplate = document.createElement('template');
        toggleButtonTemplate.innerHTML = templateText;
    })();

    return toggleButtonTemplatePromise;
}

class UdsToggleButton extends HTMLElement {
    _button = null;
    _label = null;
    _icon = null;
    _iconRight = null;
    _labelSlot = null;
    _iconSlot = null;
    _iconRightSlot = null;
    _counterElement = null;
    _dropdown = null;
    _dropdownSlot = null;

    _labelVisible = true;
    _leftIconVisible = true;
    _rightIconVisible = true;
    _counterVisible = true;
  
    static get observedAttributes() {
        return ['type', 'variant', 'size', 'round', 'disabled', 'scale', 'counter', 'active'];
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
            ensureToggleButtonStyles(),
            ensureToggleButtonTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [toggleButtonSheet];
        this.shadowRoot.appendChild(toggleButtonTemplate.content.cloneNode(true));
            
        this._button = this.shadowRoot.querySelector('.toggle-button');
        this._label = this.shadowRoot.querySelector('.label');
        this._icon = this.shadowRoot.querySelector('.icon');
        this._iconRight = this.shadowRoot.querySelector('.icon-right');
        this._labelSlot = this.shadowRoot.querySelector('slot:not([name])');
        this._iconSlot = this.shadowRoot.querySelector('slot[name="icon"]');
        this._iconRightSlot = this.shadowRoot.querySelector('slot[name="icon-right"]');
        this._counterElement = this.shadowRoot.querySelector('.counter');
        this._dropdown = this.shadowRoot.querySelector('.dropdown');
        this._dropdownSlot = this.shadowRoot.querySelector('slot[name="dropdown"]');

        if (this._labelSlot) {
            this._labelSlot.addEventListener('slotchange', () => this._updateState());
        }

        if (this._dropdownSlot) {
            this._dropdownSlot.addEventListener('slotchange', () => {
                this._syncLabelFromSelectedDropdownItem();
                this._updateState();
            });
        }

        this._syncLabelFromSelectedDropdownItem();
        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._button) return;
        
        this._button.classList.remove('toggle-button--filled', 'toggle-button--outline', 'toggle-button--ghost', 'toggle-button--text');
        this._button.classList.add(`toggle-button--${this.variant}`);
        
        this._button.classList.remove('toggle-button--primary', 'toggle-button--secondary', 'toggle-button--danger');
        this._button.classList.add(`toggle-button--${this.type}`);
        
        this._button.classList.remove('toggle-button--small', 'toggle-button--medium', 'toggle-button--large');
        this._button.classList.add(`toggle-button--${this.size}`);
        
        this._button.disabled = this.disabled;
        this._button.tabIndex = this.disabled ? -1 : 0;
        this._button.setAttribute('aria-disabled', String(this.disabled));

        this._button.setAttribute('aria-pressed', String(this.active));
        this._button.classList.toggle('active', this.active);

        this._button.classList.toggle('toggle-button--round', this.round);
        this._button.classList.toggle('toggle-button--scale', this.scale);

        const hasLeftIcon = this._iconSlot?.assignedNodes({ flatten: true }).length > 0;
        this._icon.style.display = hasLeftIcon && this._leftIconVisible ? '' : 'none';

        const hasRightIcon = this._iconRightSlot?.assignedNodes({ flatten: true }).length > 0;
        this._iconRight.style.display = hasRightIcon && this._rightIconVisible ? '' : 'none';

        const hasCounter = this.counter !== null;
        this._counterElement.textContent = hasCounter ? this.counter : '';
        this._counterElement.style.display = hasCounter && this._counterVisible ? '' : 'none';

        const hasDropdown = this._dropdownSlot?.assignedElements({ flatten: true }).length > 0;
        this.toggleAttribute('dropdown', hasDropdown);

        const hasListDropdown = Boolean(this._getDropdownList());
        const hasMenuDropdown = Boolean(this._getDropdownMenu());

        if (hasListDropdown) {
            this.setAttribute('dropdown-type', 'list');
        } else if (hasMenuDropdown) {
            this.setAttribute('dropdown-type', 'menu');
        } else {
            this.removeAttribute('dropdown-type');
        }

        if (this._dropdown) {
            this._dropdown.style.display = hasDropdown ? '' : 'none';
        }

        this._button.setAttribute('aria-haspopup', hasDropdown ? 'menu' : 'false');
        this._button.setAttribute('aria-expanded', String(hasDropdown && this.active));

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

        const path = event.composedPath();
        const isDropdownClick = path.includes(this._dropdown);
        const dropdownItem = path.find(element => {
            const tagName = element?.tagName?.toLowerCase();
            return tagName === 'uds-list-item' || tagName === 'uds-menu-item';
        });

        if (isDropdownClick) {
            if (dropdownItem) {
                this.active = false;

                const dropdownList = dropdownItem.closest('uds-list');
                const dropdownMenu = dropdownItem.closest('uds-menu');

                if (dropdownList) {
                    const value = dropdownItem.value || dropdownItem.getAttribute('value') || '';
                    const label = this._getItemLabel(dropdownItem);

                    dropdownList.value = value;
                    this.label = label;

                    this.dispatchEvent(new CustomEvent('uds-select', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            originalEvent: event,
                            type: 'list',
                            list: dropdownList,
                            item: dropdownItem,
                            value,
                            label
                        }
                    }));
                }

                if (dropdownMenu) {
                    this.dispatchEvent(new CustomEvent('uds-action', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            originalEvent: event,
                            type: 'menu',
                            menu: dropdownMenu,
                            item: dropdownItem,
                            value: dropdownItem.value || dropdownItem.getAttribute('value') || ''
                        }
                    }));
                }
            }

            return;
        }

        this.active = !this.active;
        
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

            this._onClick(event);
        }
    }
  
    _syncLabelFromSelectedDropdownItem() {
        const dropdownList = this._getDropdownList();

        if (!dropdownList) return;

        const selectedItem = this._getSelectedListItem(dropdownList);

        if (!selectedItem) return;

        this.label = this._getItemLabel(selectedItem);
    }

    _getDropdownList() {
        const dropdownElements = this._dropdownSlot?.assignedElements({ flatten: true }) || [];

        return dropdownElements.find(element =>
            element.tagName?.toLowerCase() === 'uds-list'
        ) || null;
    }

    _getDropdownMenu() {
        const dropdownElements = this._dropdownSlot?.assignedElements({ flatten: true }) || [];

        return dropdownElements.find(element =>
            element.tagName?.toLowerCase() === 'uds-menu'
        ) || null;
    }

    _getSelectedListItem(list) {
        return list?.querySelector?.('uds-list-item[selected]') || null;
    }

    _getItemLabel(item) {
        return item?.getAttribute('label') || item?.textContent?.replace(/\s+/g, ' ').trim() || '';
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

    get active() {
        return this.hasAttribute('active');
    }

    set active(value) {
        this.toggleAttribute('active', !!value);
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

customElements.define('uds-toggle-button', UdsToggleButton);

export default UdsToggleButton;