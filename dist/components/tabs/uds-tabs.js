const tabSheet = new CSSStyleSheet();
let tabStylesPromise = false;

let tabTemplate = null;
let tabTemplatePromise = false;

const tabsSheet = new CSSStyleSheet();
let tabsStylesPromise = false;

let tabsTemplate = null;
let tabsTemplatePromise = false;

function ensureTabStyles() {
    if (tabStylesPromise) return tabStylesPromise;

    tabStylesPromise = (async () => {
        const cssUrl = new URL('./uds-tab.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await tabSheet.replace(css);
    })();

    return tabStylesPromise;
}

function ensureTabTemplate() {
    if (tabTemplatePromise) return tabTemplatePromise;

    tabTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-tab.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        tabTemplate = document.createElement('template');
        tabTemplate.innerHTML = templateText;
    })();

    return tabTemplatePromise;
}

function ensureTabsStyles() {
    if (tabsStylesPromise) return tabsStylesPromise;

    tabsStylesPromise = (async () => {
        const cssUrl = new URL('./uds-tabs.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await tabsSheet.replace(css);
    })();

    return tabsStylesPromise;
}


function ensureTabsTemplate() {
    if (tabsTemplatePromise) return tabsTemplatePromise;

    tabsTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-tabs.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        tabsTemplate = document.createElement('template');
        tabsTemplate.innerHTML = templateText;
    })();

    return tabsTemplatePromise;
}

function normalizeTabsLevel(level) {
    const levels = {
        browser: 'l1',
        body: 'l2',
        section: 'l3',
        panel: 'l4',
        1: 'l1',
        2: 'l2',
        3: 'l3',
        4: 'l4',
        l1: 'l1',
        l2: 'l2',
        l3: 'l3',
        l4: 'l4'
    };

    return levels[String(level).toLowerCase()] || 'l2';
}

class UdsTab extends HTMLElement {
    _tab = null;
    _label = null;
    _icon = null;
    _iconRight = null;
    _iconTop = null;
    _iconTopNextSibling = null;
    _button = null;
    _labelSlot = null;
    _iconSlot = null;
    _iconRightSlot = null;
    _iconTopSlot = null;
    _buttonSlot = null;
    _counterElement = null;

    _labelVisible = true;
    _leftIconVisible = true;
    _rightIconVisible = true;
    _topIconVisible = true;
    _buttonVisible = true;
    _counterVisible = true;
  
    static get observedAttributes() {
        return ['level', 'active', 'disabled', 'counter', 'delimiters', 'fill'];
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
        if (!this.hasAttribute('level')) this.level = 'l2';
    }

    async _render() {
        if (!this.shadowRoot || this._tab) return;

        await Promise.all([
            ensureTabStyles(),
            ensureTabTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [tabSheet];
        this.shadowRoot.appendChild(tabTemplate.content.cloneNode(true));
            
        this._tab = this.shadowRoot.querySelector('.tab');
        this._label = this.shadowRoot.querySelector('.label');
        this._icon = this.shadowRoot.querySelector('.icon');
        this._iconRight = this.shadowRoot.querySelector('.icon-right');
        this._iconTop = this.shadowRoot.querySelector('.icon-top');
        this._iconTopNextSibling = this._iconTop?.nextSibling || null;
        this._button = this.shadowRoot.querySelector('.button');
        this._labelSlot = this.shadowRoot.querySelector('slot:not([name])');
        this._iconSlot = this.shadowRoot.querySelector('slot[name="icon"]');
        this._iconRightSlot = this.shadowRoot.querySelector('slot[name="icon-right"]');
        this._iconTopSlot = this.shadowRoot.querySelector('slot[name="icon-top"]');
        this._buttonSlot = this.shadowRoot.querySelector('slot[name="button"]');
        this._counterElement = this.shadowRoot.querySelector('.counter');

        if (this._labelSlot) {
            this._labelSlot.addEventListener('slotchange', () => this._updateState());
        }

        if (this._iconSlot) {
            this._iconSlot.addEventListener('slotchange', () => this._updateState());
        }

        if (this._iconRightSlot) {
            this._iconRightSlot.addEventListener('slotchange', () => this._updateState());
        }

        if (this._iconTopSlot) {
            this._iconTopSlot.addEventListener('slotchange', () => this._updateState());
        }

        if (this._buttonSlot) {
            this._buttonSlot.addEventListener('slotchange', () => this._updateState());
        }

        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._tab) return;
        
        this._tab.classList.remove('tab--l1', 'tab--l2', 'tab--l3', 'tab--l4');
        this._tab.classList.add(`tab--${this.level}`);

        if (this.level === 'l2') {
            if (this._iconTop && !this._iconTop.isConnected) {
                const wrapper = this.shadowRoot.querySelector('.wrapper');
                wrapper?.insertBefore(this._iconTop, this._iconTopNextSibling);
            }
        } else if (this._iconTop?.isConnected) {
            this._iconTop.remove();
        }

        this._tab.classList.toggle('active', this.active);
        this._tab.setAttribute('aria-selected', String(this.active));
        this._tab.tabIndex = this.active ? 0 : -1;

        this._tab.disabled = this.disabled;
        this._tab.setAttribute('aria-disabled', String(this.disabled));

        const button = this.getButtonElement();
        if (button) {
            button.disabled = this.disabled;
        }

        const hasCounter = this.counter !== null;
        if (this._counterElement) {
            this._counterElement.textContent = hasCounter ? this.counter : '';
            this._counterElement.style.display = hasCounter && this._counterVisible ? '' : 'none';
        }

        const hasLeftIcon = this._iconSlot?.assignedNodes({ flatten: true }).length > 0;
        if (this._icon) {
            this._icon.style.display = hasLeftIcon && this._leftIconVisible ? '' : 'none';
        }

        const hasRightIcon = this._iconRightSlot?.assignedNodes({ flatten: true }).length > 0;
        if (this._iconRight) {
            this._iconRight.style.display = hasRightIcon && this._rightIconVisible ? '' : 'none';
        }

        const hasTopIcon = this._iconTopSlot?.assignedNodes({ flatten: true }).length > 0;
        if (this._iconTop) {
            this._iconTop.style.display = hasTopIcon && this._topIconVisible ? '' : 'none';
        }

        const hasButton = this._buttonSlot?.assignedNodes({ flatten: true }).length > 0;
        if (this._button) {
            this._button.style.display = hasButton && this._buttonVisible ? '' : 'none';
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
        // ?
    }

    get value() {
        return this.getAttribute('value');
    }

    set value(value) {
        this.setAttribute('value', value);
    }

    get level() {
        return normalizeTabsLevel(this.getAttribute('level'));
    }

    set level(value) {
        this.setAttribute('level', value);
    }

    get active() {
        return this.hasAttribute('active');
    }

    set active(value) {
        this.toggleAttribute('active', Boolean(value));
    }


    get disabled() {
        return this.hasAttribute('disabled');
    }

    set disabled(value) {
        this.toggleAttribute('disabled', Boolean(value));
    }


    get delimiters() {
        return this.hasAttribute('delimiters');
    }

    set delimiters(value) {
        this.toggleAttribute('delimiters', Boolean(value));
    }


    get fill() {
        return this.hasAttribute('fill');
    }

    set fill(value) {
        this.toggleAttribute('fill', Boolean(value));
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
            const beforeNode = Array.from(this.children).find(child =>
                child.getAttribute('slot') === 'icon-right' ||
                child.getAttribute('slot') === 'button'
            ) || null;

            this.insertBefore(
                document.createTextNode(value),
                beforeNode
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

    showTopIcon() {
        this._topIconVisible = true;
        this._updateState();
    }

    hideTopIcon() {
        this._topIconVisible = false;
        this._updateState();
    }

    showButton() {
        this._buttonVisible = true;
        this._updateState();
    }

    hideButton() {
        this._buttonVisible = false;
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

    getTopIconElement() {
        return this._iconTopSlot?.assignedElements({ flatten: true })[0] || null;
    }

    getButtonElement() {
        return this._buttonSlot?.assignedElements({ flatten: true })[0] || null;
    }
}


class UdsTabs extends HTMLElement {
    _tabBar = null;
    _slot = null;
    _tabs = [];
  
    static get observedAttributes() {
        return ['level', 'value', 'delimiters', 'fill', 'width'];
    }

    constructor() {
        super();

        this._onClick = this._onClick.bind(this);
        this._onSlotChange = this._collectTabs.bind(this);
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
        if (!this.hasAttribute('level')) this.level = 'l2';
    }

    async _render() {
        if (!this.shadowRoot || this._tabBar) return;

        await Promise.all([
            ensureTabsStyles(),
            ensureTabsTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [tabsSheet];
        this.shadowRoot.appendChild(tabsTemplate.content.cloneNode(true));
            
        this._tabBar = this.shadowRoot.querySelector('.tabs');
        this._slot = this.shadowRoot.querySelector('slot');

        if (this._slot) {
            this._slot.addEventListener('slotchange', this._onSlotChange);
        }

        this._collectTabs();
        this._updateState();
        this._resolveReady();
    }

    _updateState() {
        if (!this._tabBar) return;
        
        this._tabBar.classList.remove('tabs--l1', 'tabs--l2', 'tabs--l3', 'tabs--l4');
        this._tabBar.classList.add(`tabs--${this.level}`);
        this._tabBar.classList.toggle('tabs--delimiters', this.delimiters);
        this._tabBar.classList.toggle('tabs--fill', this.fill);
        this.style.width = this.width || (this.fill ? '100%' : '');

        if (!this.value && this._tabs.length > 0) {
            const firstValue = this._tabs[0].getAttribute('value') ?? '0';
            this.value = firstValue;
            return;
        }

        const activeIndex = this._tabs.findIndex((tab, index) => {
            const tabValue = tab.getAttribute('value') ?? String(index);
            return tabValue === this.value;
        });

        this._tabs.forEach((tab, index) => {
            const tabValue = tab.getAttribute('value') ?? String(index);
            const isActive = tabValue === this.value;
            const showDelimiter = this.delimiters && index > 0 && index !== activeIndex && index !== activeIndex + 1;

            tab.level = this.level;
            tab.active = isActive;
            tab.delimiters = showDelimiter;
            tab.fill = this.fill;
        });
    }

    _collectTabs() {
        if (!this._slot) return;

        this._tabs = this._slot
            .assignedElements({ flatten: true })
            .filter(el => el.tagName.toLowerCase() === 'uds-tab');

        this._updateState();
    }

    _onClick(event) {
        const path = event.composedPath();
        const clickedTab = this._tabs.find(tab => path.includes(tab));

        if (!clickedTab) return;

        const nextValue =
            clickedTab.getAttribute('value') ??
            String(this._tabs.indexOf(clickedTab));

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
  
    get level() {
        return normalizeTabsLevel(this.getAttribute('level'));
    }

    set level(value) {
        this.setAttribute('level', value);
    }

    get delimiters() {
        return this.hasAttribute('delimiters');
    }

    set delimiters(value) {
        this.toggleAttribute('delimiters', Boolean(value));
    }


    get fill() {
        return this.hasAttribute('fill');
    }

    set fill(value) {
        this.toggleAttribute('fill', Boolean(value));
    }

    get width() {
        return this.getAttribute('width');
    }

    set width(value) {
        if (value == null || value === '') {
            this.removeAttribute('width');
        } else {
            this.setAttribute('width', value);
        }
    }
}

customElements.define('uds-tab', UdsTab);
customElements.define('uds-tabs', UdsTabs);

export default UdsTabs;
export { UdsTab };