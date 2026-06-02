const listItemSheet = new CSSStyleSheet();
let listItemStylesPromise = false;

let listItemTemplate = null;
let listItemTemplatePromise = false;

function ensureListItemStyles() {
    if (listItemStylesPromise) return listItemStylesPromise;

    listItemStylesPromise = (async () => {
        const cssUrl = new URL('./uds-list-item.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await listItemSheet.replace(css);
    })();

    return listItemStylesPromise;
}

function ensureListItemTemplate() {
    if (listItemTemplatePromise) return listItemTemplatePromise;

    listItemTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-list-item.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        listItemTemplate = document.createElement('template');
        listItemTemplate.innerHTML = templateText;
    })();

    return listItemTemplatePromise;
}

class UdsListItem extends HTMLElement {
    _button = null;
    _label = null;
    _dragger = null;
    _icon = null;
    _labelSlot = null;
    _draggerSlot = null;
    _iconSlot = null;
    _descriptionElement = null;
    _noteElement = null;
    _button1 = null;
    _button2 = null;
    _button1Slot = null;
    _button2Slot = null;

    _labelVisible = true;
    _draggerVisible = true;
    _leftIconVisible = true;
    _button1Visible = true;
    _button2Visible = true;
    _noteVisible = true;
    _descriptionVisible = true;
    _checkmarkVisible = true;
  
    static get observedAttributes() {
        return ['type', 'variant', 'disabled', 'note', 'active', 'selected', 'sublist', 'scale', 'round', 'description'];
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
            ensureListItemStyles(),
            ensureListItemTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [listItemSheet];
        this.shadowRoot.appendChild(listItemTemplate.content.cloneNode(true));
            
        this._button = this.shadowRoot.querySelector('.list-item');
        this._label = this.shadowRoot.querySelector('.label');
        this._dragger = this.shadowRoot.querySelector('.dragger');
        this._checkmark = this.shadowRoot.querySelector('.checkmark');
        this._icon = this.shadowRoot.querySelector('.icon');
        this._button1 = this.shadowRoot.querySelector('.button-1');
        this._button2 = this.shadowRoot.querySelector('.button-2');
        this._chevron = this.shadowRoot.querySelector('.chevron');
        this._labelSlot = this.shadowRoot.querySelector('slot:not([name])');
        this._draggerSlot = this.shadowRoot.querySelector('slot[name="dragger"]');
        this._checkmarkSlot = this.shadowRoot.querySelector('slot[name="checkmark"]');
        this._iconSlot = this.shadowRoot.querySelector('slot[name="icon"]');
        this._button1Slot = this.shadowRoot.querySelector('slot[name="button-1"]');
        this._button2Slot = this.shadowRoot.querySelector('slot[name="button-2"]');
        this._chevronSlot = this.shadowRoot.querySelector('slot[name="chevron"]');
        this._descriptionElement = this.shadowRoot.querySelector('.description');
        this._noteElement = this.shadowRoot.querySelector('.note');

        [
            this._labelSlot,
            this._draggerSlot,
            this._iconSlot,
            this._button1Slot,
            this._button2Slot,
            this._checkmarkSlot,
            this._chevronSlot
        ].forEach(slot => {
            slot?.addEventListener('slotchange', () => this._updateState());
        });

        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._button) return;
        
        this._button.classList.remove('list-item--filled', 'list-item--outline', 'list-item--ghost', 'list-item--text');
        this._button.classList.add(`list-item--${this.variant}`);
        
        this._button.classList.remove('list-item--primary', 'list-item--secondary', 'list-item--danger');
        this._button.classList.add(`list-item--${this.type}`);

        this._button.classList.toggle('list-item--round', this.round);
        this._button.classList.toggle('list-item--scale', this.scale);
        
        this._button.disabled = this.disabled;
        this._button.tabIndex = this.disabled ? -1 : 0;
        this._button.setAttribute('aria-disabled', String(this.disabled));

        this._button.classList.toggle('active', this.active);
        this._button.setAttribute('aria-pressed', String(this.active));

        this._checkmark.style.display = this._checkmarkVisible ? '' : 'none';
        this._dragger.style.display = this._draggerVisible ? '' : 'none';

        const hasLeftIcon = this._iconSlot?.assignedNodes({ flatten: true }).length > 0;
        this._icon.style.display = hasLeftIcon && this._leftIconVisible ? '' : 'none';

        const hasButton1 = this._button1Slot?.assignedNodes({ flatten: true }).length > 0;
        this._button1.style.display = hasButton1 && this._button1Visible ? '' : 'none';

        const hasButton2 = this._button2Slot?.assignedNodes({ flatten: true }).length > 0;
        this._button2.style.display = hasButton2 && this._button2Visible ? '' : 'none';

        const hasChildren = this.hasAttribute('sublist');
        this._chevron.style.display = hasChildren ? '' : 'none';

        const hasNote = this.note !== null;
        this._noteElement.textContent = hasNote ? this.note : '';
        this._noteElement.style.display = hasNote && this._noteVisible ? '' : 'none';

        const hasDescription = this.description !== null;
        this._descriptionElement.textContent = hasDescription ? this.description : '';
        this._descriptionElement.style.display = hasDescription && this._descriptionVisible ? '' : 'none';

        this._button.classList.toggle('selected', this.selected);

        const list = this.closest('uds-list');
        const isListbox = list?.mode === 'listbox' || list?.mode === 'listbox-classic';
        const isClassicListbox = list?.mode === 'listbox-classic';

        this.toggleAttribute('listbox-classic', isClassicListbox);

        if (isClassicListbox) {
            this._checkmark.style.display = 'none';
        }

        if (isListbox) {
            this._button.setAttribute('role', 'option');
            this._button.setAttribute('aria-selected', String(this.selected));
            this._button.removeAttribute('aria-checked');
        } else {
            this._button.setAttribute('role', 'listitem');
            this._button.removeAttribute('aria-selected');
            this._button.removeAttribute('aria-checked');
        }

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

        if (this.hasAttribute('sublist')) {
            this.dispatchEvent(new CustomEvent('uds-list-item-activate', {
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

        if (event.key === 'ArrowRight' && this.hasAttribute('sublist')) {
            event.preventDefault();

            this.dispatchEvent(new CustomEvent('uds-list-item-activate', {
                bubbles: true,
                composed: true,
                detail: { item: this, by: 'keyboard', originalEvent: event }
            }));
        }
    }

    _onPointerEnter(event) {
        if (this.disabled) return;

        this.dispatchEvent(new CustomEvent('uds-list-item-enter', {
            bubbles: true,
            composed: true,
            detail: { item: this, originalEvent: event }
        }));
    }

    _onPointerLeave(event) {
        if (this.disabled) return;

        this.dispatchEvent(new CustomEvent('uds-list-item-leave', {
            bubbles: true,
            composed: true,
            detail: { item: this, originalEvent: event, relatedTarget: event.relatedTarget }
        }));
    }
  
    get type() {
        return (
            this.getAttribute('type') ||
            this.closest('uds-list-section')?.type ||
            this.closest('uds-list')?.type ||
            'primary'
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

    get sublist() {
        return this.getAttribute('sublist');
    }

    set sublist(value) {
        value == null ? this.removeAttribute('sublist') : this.setAttribute('sublist', value);
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
            const beforeNode = this.querySelector('[slot="button-1"], [slot="button-2"]');

            this.insertBefore(
                document.createTextNode(value),
                beforeNode || null
            );
        }
    }

    hideCheckmark() {
        this._checkmarkVisible = false;
        this._updateState();
    }

    showCheckmark() {
        this._checkmarkVisible = true;
        this._updateState();
    }

    hideDragger() {
        this._draggerVisible = false;
        this._updateState();
    }

    showDragger() {
        this._draggerVisible = true;
        this._updateState();
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

    showButton1() {
        this._button1Visible = true;
        this._updateState();
    }

    hideButton1() {
        this._button1Visible = false;
        this._updateState();
    }

    showButton2() {
        this._button2Visible = true;
        this._updateState();
    }

    hideButton2() {
        this._button2Visible = false;
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

    getDraggerElement() {
        return this._draggerSlot?.assignedElements({ flatten: true })[0] || null;
    }
}

customElements.define('uds-list-item', UdsListItem);

export default UdsListItem;