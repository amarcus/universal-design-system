const menuItemSheet = new CSSStyleSheet();
let menuItemStylesPromise = false;

let menuItemTemplate = null;
let menuItemTemplatePromise = false;

function ensureMenuItemStyles() {
    if (menuItemStylesPromise) return menuItemStylesPromise;

    menuItemStylesPromise = (async () => {
        const cssUrl = new URL('./uds-menu-item.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await menuItemSheet.replace(css);
    })();

    return menuItemStylesPromise;
}

function ensureMenuItemTemplate() {
    if (menuItemTemplatePromise) return menuItemTemplatePromise;

    menuItemTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-menu-item.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        menuItemTemplate = document.createElement('template');
        menuItemTemplate.innerHTML = templateText;
    })();

    return menuItemTemplatePromise;
}

class UdsMenuItem extends HTMLElement {
    _button = null;
    _label = null;
    _icon = null;
    _iconRight = null;
    _labelSlot = null;
    _iconSlot = null;
    _iconRightSlot = null;
    _descriptionElement = null;
    _noteElement = null;

    _labelVisible = true;
    _leftIconVisible = true;
    _rightIconVisible = true;
    _noteVisible = true;
    _descriptionVisible = true;
  
    static get observedAttributes() {
        return ['type', 'variant', 'disabled', 'note', 'active', 'selected', 'submenu', 'scale', 'round', 'description'];
    }

    constructor() {
        super();

        this._onClick = this._onClick.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onPointerEnter = this._onPointerEnter.bind(this);
        this._onPointerLeave = this._onPointerLeave.bind(this);

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
        this.addEventListener('pointerenter', this._onPointerEnter);
        this.addEventListener('pointerleave', this._onPointerLeave);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this._onClick);
        this.removeEventListener('keydown', this._onKeyDown);
        this.removeEventListener('pointerenter', this._onPointerEnter);
        this.removeEventListener('pointerleave', this._onPointerLeave);
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
        if (!this.hasAttribute('variant')) this.variant = 'filled';
    }

    async _render() {
        if (!this.shadowRoot || this._button) return;

        await Promise.all([
            ensureMenuItemStyles(),
            ensureMenuItemTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [menuItemSheet];
        this.shadowRoot.appendChild(menuItemTemplate.content.cloneNode(true));
            
        this._button = this.shadowRoot.querySelector('.menu-item');
        this._label = this.shadowRoot.querySelector('.label');
        this._checkmark = this.shadowRoot.querySelector('.checkmark');
        this._icon = this.shadowRoot.querySelector('.icon');
        this._iconRight = this.shadowRoot.querySelector('.icon-right');
        this._chevron = this.shadowRoot.querySelector('.chevron');
        this._labelSlot = this.shadowRoot.querySelector('slot:not([name])');
        this._checkmarkSlot = this.shadowRoot.querySelector('slot[name="checkmark"]');
        this._iconSlot = this.shadowRoot.querySelector('slot[name="icon"]');
        this._iconRightSlot = this.shadowRoot.querySelector('slot[name="icon-right"]');
        this._chevronSlot = this.shadowRoot.querySelector('slot[name="chevron"]');
        this._descriptionElement = this.shadowRoot.querySelector('.description');
        this._noteElement = this.shadowRoot.querySelector('.note');

        if (this._labelSlot) {
            this._labelSlot.addEventListener('slotchange', () => this._updateState());
        }

        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._button) return;
        
        this._button.classList.remove('menu-item--filled', 'menu-item--outline', 'menu-item--ghost', 'menu-item--text');
        this._button.classList.add(`menu-item--${this.variant}`);
        
        this._button.classList.remove('menu-item--primary', 'menu-item--secondary', 'menu-item--danger');
        this._button.classList.add(`menu-item--${this.type}`);

        this._button.classList.toggle('menu-item--round', this.round);
        this._button.classList.toggle('menu-item--scale', this.scale);
        
        this._button.disabled = this.disabled;
        this._button.tabIndex = this.disabled ? -1 : 0;
        this._button.setAttribute('aria-disabled', String(this.disabled));

        this._button.classList.toggle('active', this.active);
        this._button.setAttribute('aria-pressed', String(this.active));

        const hasLeftIcon = this._iconSlot?.assignedNodes({ flatten: true }).length > 0;
        this._icon.style.display = hasLeftIcon && this._leftIconVisible ? '' : 'none';

        const hasRightIcon = this._iconRightSlot?.assignedNodes({ flatten: true }).length > 0;
        this._iconRight.style.display = hasRightIcon && this._rightIconVisible ? '' : 'none';

        const hasChildren = this.hasAttribute('submenu');
        this._chevron.style.display = hasChildren ? '' : 'none';

        const hasNote = this.note !== null;
        this._noteElement.textContent = hasNote ? this.note : '';
        this._noteElement.style.display = hasNote && this._noteVisible ? '' : 'none';

        const hasDescription = this.description !== null;
        this._descriptionElement.textContent = hasDescription ? this.description : '';
        this._descriptionElement.style.display = hasDescription && this._descriptionVisible ? '' : 'none';

        this._button.classList.toggle('selected', this.selected);
        this._button.setAttribute('aria-checked', String(this.selected));

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
        
        this.dispatchEvent(new CustomEvent('uds-click', {
            bubbles: true,
            composed: true,
            detail: { originalEvent: event, item: this }
        }));

        if (this.hasAttribute('submenu')) {
            this.dispatchEvent(new CustomEvent('uds-menu-item-activate', {
                bubbles: true,
                composed: true,
                detail: { item: this, by: 'click', originalEvent: event }
            }));
        }
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

        if (event.key === 'ArrowRight' && this.hasAttribute('submenu')) {
            event.preventDefault();

            this.dispatchEvent(new CustomEvent('uds-menu-item-activate', {
                bubbles: true,
                composed: true,
                detail: { item: this, by: 'keyboard', originalEvent: event }
            }));
        }
    }

    _onPointerEnter(event) {
        if (this.disabled) return;

        this.dispatchEvent(new CustomEvent('uds-menu-item-enter', {
            bubbles: true,
            composed: true,
            detail: { item: this, originalEvent: event }
        }));
    }

    _onPointerLeave(event) {
        if (this.disabled) return;

        this.dispatchEvent(new CustomEvent('uds-menu-item-leave', {
            bubbles: true,
            composed: true,
            detail: { item: this, originalEvent: event, relatedTarget: event.relatedTarget }
        }));
    }
  
    get type() {
        return (
            this.getAttribute('type') ||
            this.closest('uds-menu-section')?.type ||
            this.closest('uds-menu')?.type ||
            'secondary'
        );
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

    get active() {
        return this.hasAttribute('active');
    }

    set active(value) {
        this.toggleAttribute('active', !!value);
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
    
    get note() {
        return this.getAttribute('note');
    }

    set note(value) {
        this.setAttribute('note', value);
    }

    get selected() {
        return this.hasAttribute('selected');
    }

    set selected(value) {
        this.toggleAttribute('selected', !!value);
    }

    get submenu() {
        return this.getAttribute('submenu');
    }

    set submenu(value) {
        value == null ? this.removeAttribute('submenu') : this.setAttribute('submenu', value);
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

    hideNote() {
        this._noteVisible = false;
        this._updateState();
    }

    showNote() {
        this._noteVisible = true;
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

    getRightIconElement() {
        return this._iconRightSlot?.assignedElements({ flatten: true })[0] || null;
    }

    getCheckmarkElement() {
        return this._checkmarkSlot?.assignedElements({ flatten: true })[0] || null;
    }
}

customElements.define('uds-menu-item', UdsMenuItem);

export default UdsMenuItem;