const menuSheet = new CSSStyleSheet();
let menuStylesPromise = false;

let menuTemplate = null;
let menuTemplatePromise = false;

function ensureMenuStyles() {
    if (menuStylesPromise) return menuStylesPromise;

    menuStylesPromise = (async () => {
        const cssUrl = new URL('./uds-menu.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await menuSheet.replace(css);
    })();

    return menuStylesPromise;
}

function ensureMenuTemplate() {
    if (menuTemplatePromise) return menuTemplatePromise;

    menuTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-menu.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        menuTemplate = document.createElement('template');
        menuTemplate.innerHTML = templateText;
    })();

    return menuTemplatePromise;
}

class UdsMenu extends HTMLElement {
    _menu = null;
    _slot = null;
    _sections = [];

    _activeItem = null;
    _pendingItem = null;
    _switchTimer = null;
    _closeTimer = null;
    _pointerHistory = [];
    _maxPointerHistory = 6;

    static get observedAttributes() {
        return ['variant', 'type'];
    }

    constructor() {
        super();

        this._onPointerMove = this._onPointerMove.bind(this);
        this._onPointerLeave = this._onPointerLeave.bind(this);
        this._onItemEnter = this._onItemEnter.bind(this);
        this._onItemActivate = this._onItemActivate.bind(this);

        this.attachShadow({ mode: 'open' });

        this.ready = new Promise(resolve => {
            this._resolveReady = resolve;
        });
    }

    connectedCallback() {
        this._initDefaults();
        this._render();

        this.addEventListener('pointermove', this._onPointerMove);
        this.addEventListener('pointerleave', this._onPointerLeave);
        this.addEventListener('uds-menu-item-enter', this._onItemEnter);
        this.addEventListener('uds-menu-item-activate', this._onItemActivate);

        this.constructor.observedAttributes.forEach(prop => {
            this._upgradeProperty(prop);
        });
    }

    disconnectedCallback() {
        this.removeEventListener('pointermove', this._onPointerMove);
        this.removeEventListener('pointerleave', this._onPointerLeave);
        this.removeEventListener('uds-menu-item-enter', this._onItemEnter);
        this.removeEventListener('uds-menu-item-activate', this._onItemActivate);

        this._clearTimers();
    }

    _ownsItem(item) {
        return item.closest('uds-menu') === this;
    }

    _clearTimers() {
        if (this._switchTimer) {
            clearTimeout(this._switchTimer);
            this._switchTimer = null;
        }

        if (this._closeTimer) {
            clearTimeout(this._closeTimer);
            this._closeTimer = null;
        }
    }

    _onPointerMove(event) {
        this._pointerHistory.push({ x: event.clientX, y: event.clientY, t: Date.now() });

        if (this._pointerHistory.length > this._maxPointerHistory) {
            this._pointerHistory.shift();
        }

        if (this._pendingItem && this._activeItem) {
            const submenu = this._getOpenSubmenuForItem(this._activeItem);

            if (submenu && event.composedPath().includes(submenu)) {
                this._pendingItem = null;

                if (this._switchTimer) {
                    clearTimeout(this._switchTimer);
                    this._switchTimer = null;
                }

                return;
            }
        }

        if (this._pendingItem && !this._shouldDelayActivation(this._pendingItem)) {
            const pending = this._pendingItem;
            this._pendingItem = null;

            if (this._switchTimer) {
                clearTimeout(this._switchTimer);
                this._switchTimer = null;
            }

            this._activateItem(pending);
        }
    }

    _onPointerLeave(event) {
        const next = event.relatedTarget;

        if (next && this._isInsideMenuTree(next)) {
            return;
        }

        this._scheduleCloseAll();
    }

    _onItemEnter(event) {
        const item = event.detail?.item;
        if (!item || item.disabled || !this._ownsItem(item)) return;

        this._cancelCloseAll();

        if (item === this._activeItem) return;

        if (this._shouldDelayActivation(item)) {
            this._pendingItem = item;

            if (this._switchTimer) clearTimeout(this._switchTimer);
            this._switchTimer = setTimeout(() => {
                if (this._pendingItem) {
                    this._activateItem(this._pendingItem);
                    this._pendingItem = null;
                }
                this._switchTimer = null;
            }, 250);

            return;
        }

        this._pendingItem = null;
        if (this._switchTimer) {
            clearTimeout(this._switchTimer);
            this._switchTimer = null;
        }

        this._activateItem(item);
    }

    _onItemActivate(event) {
        const item = event.detail?.item;
        if (!item || item.disabled || !this._ownsItem(item)) return;

        this._cancelCloseAll();
        this._activateItem(item, { force: true });
    }

    _scheduleCloseAll() {
        this._cancelCloseAll();

        this._closeTimer = setTimeout(() => {
            this.closeAll();
        }, 1000);
    }

    _cancelCloseAll() {
        if (this._closeTimer) {
            clearTimeout(this._closeTimer);
            this._closeTimer = null;
        }
    }

    _getRootMenu() {
        let node = this;
        let parentMenu = node.parentElement?.closest?.('uds-menu');

        while (parentMenu) {
            node = parentMenu;
            parentMenu = node.parentElement?.closest?.('uds-menu');
        }

        return node;
    }

    _isInsideMenuTree(node) {
        const root = this._getRootMenu();
        let current = node;

        while (current) {
            if (current === root) return true;

            if (current.parentNode) {
                current = current.parentNode;
            } else {
                current = current.getRootNode?.().host || null;
            }
        }

        return false;
    }

    _getSubmenuByName(name) {
        if (!name) return null;

        const root = this._getRootMenu();
        return [...root.querySelectorAll('uds-menu[submenu]')].find(menu =>
            menu.getAttribute('submenu') === name
        ) || null;
    }

    _getOpenSubmenuForItem(item) {
        if (!item?.hasAttribute('submenu')) return null;
        return this._getSubmenuByName(item.getAttribute('submenu'));
    }

    _positionSubmenu(item, submenu) {
        const itemRect = item.getBoundingClientRect();
        const rootRect = this._getRootMenu().getBoundingClientRect();
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const margin = 8;

        submenu.style.position = 'absolute';
        submenu.style.top = `${itemRect.top - rootRect.top + margin}px`;

        const submenuWidth = submenu.offsetWidth || submenu.getBoundingClientRect().width;

        const spaceRight = viewportWidth - itemRect.right;
        const spaceLeft = itemRect.left;

        const shouldOpenLeft = spaceRight < submenuWidth + margin && spaceLeft >= submenuWidth + margin;

        if (shouldOpenLeft) {
            submenu.style.left = `${itemRect.left - rootRect.left - submenuWidth + margin}px`;
        } else {
            submenu.style.left = `${itemRect.right - rootRect.left - margin}px`;
        }
    }

    _activateItem(item, { force = false } = {}) {
        const previous = this._activeItem;

        if (!force && previous === item) return;

        if (previous && previous !== item) {
            previous.removeAttribute('submenu-open');

            const prevSubmenu = this._getOpenSubmenuForItem(previous);
            if (prevSubmenu) {
                prevSubmenu.removeAttribute('open');
                prevSubmenu.style.top = '';
                prevSubmenu.style.left = '';
            }
        }

        this._activeItem = item;

        const submenu = this._getOpenSubmenuForItem(item);

        if (!submenu) {
            item.removeAttribute('submenu-open');
            return;
        }

        item.setAttribute('submenu-open', '');
        submenu.setAttribute('open', '');
        this._positionSubmenu(item, submenu);

        const root = this._getRootMenu();

        root.querySelectorAll('uds-menu[submenu]').forEach(menu => {
            if (menu !== submenu) {
                menu.removeAttribute('open');
                menu.style.top = '';
                menu.style.left = '';
                menu.style.position = '';
            }
        });

        root.querySelectorAll('uds-menu-item[submenu]').forEach(menuItem => {
            if (menuItem !== item) {
                menuItem.removeAttribute('submenu-open');
            }
        });
    }

    closeAll() {
        this._clearTimers();
        this._pendingItem = null;
        this._activeItem = null;

        const root = this._getRootMenu();

        root.querySelectorAll('uds-menu[submenu]').forEach(menu => {
            menu.removeAttribute('open');
            menu.style.top = '';
            menu.style.left = '';
            menu.style.position = '';
        });

        root.querySelectorAll('uds-menu-item[submenu]').forEach(item => {
            item.removeAttribute('submenu-open');
        });
    }

    _shouldDelayActivation(nextItem) {
        if (!this._activeItem) return false;
        if (nextItem === this._activeItem) return false;
        if (!this._activeItem.hasAttribute('submenu')) return false;

        const submenu = this._getOpenSubmenuForItem(this._activeItem);
        if (!submenu || !submenu.hasAttribute('open')) return false;

        const points = this._pointerHistory;
        if (points.length < 2) return false;

        const prev = points[points.length - 2];
        const curr = points[points.length - 1];
        const rect = submenu.getBoundingClientRect();
        const activeRect = this._activeItem.getBoundingClientRect();
        const tolerance = 12;
        const opensLeft = rect.right <= activeRect.left;
        const edgeX = opensLeft ? rect.right + tolerance : rect.left - tolerance;
        const upper = { x: edgeX, y: rect.top - tolerance };
        const lower = { x: edgeX, y: rect.bottom + tolerance };

        return this._pointInTriangle(curr, prev, upper, lower);
    }

    _pointInTriangle(p, a, b, c) {
        const area = (p1, p2, p3) =>
            (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));

        const d1 = area(p, a, b);
        const d2 = area(p, b, c);
        const d3 = area(p, c, a);

        const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
        const hasPos = d1 > 0 || d2 > 0 || d3 > 0;

        return !(hasNeg && hasPos);
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
        if (!this.hasAttribute('type')) this.type = 'secondary';
    }

    async _render() {
        if (!this.shadowRoot || this._menu) return;

        await Promise.all([
            ensureMenuStyles(),
            ensureMenuTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [menuSheet];
        this.shadowRoot.appendChild(menuTemplate.content.cloneNode(true));

        this._menu = this.shadowRoot.querySelector('.menu');
        this._slot = this.shadowRoot.querySelector('slot');

        this._slot?.addEventListener('slotchange', () => this._collectSections());

        this._collectSections();
        this._resolveReady();
    }

    _collectSections() {
        if (!this._slot) return;

        this._sections = this._slot
            .assignedElements({ flatten: true })
            .filter(el => el.tagName.toLowerCase() === 'uds-menu-section');

        this._updateState();
    }

    _updateState() {
        if (!this._menu) return;

        this._menu.setAttribute('role', 'menu');

        this._sections.forEach((section, index) => {
            section.toggleAttribute('first-section', index === 0);
            section.toggleAttribute('last-section', index === this._sections.length - 1);
        });

        const items = this.querySelectorAll('uds-menu-item');

        items.forEach(item => {
            item.variant = this.variant;
            item._updateState?.();
        });

        const submenus = [...this.children].filter(el =>
            el.tagName?.toLowerCase() === 'uds-menu'
        );

        submenus.forEach(menu => {
            menu.variant = this.variant;

            if (!menu.hasAttribute('type')) {
                menu.type = this.type;
            }
        });
    }

    get variant() {
        return this.getAttribute('variant');
    }

    set variant(value) {
        this.setAttribute('variant', value);
    }

    get type() {
        return this.getAttribute('type') || 'secondary';
    }

    set type(value) {
        this.setAttribute('type', value);
    }
}

customElements.define('uds-menu', UdsMenu);

export default UdsMenu;