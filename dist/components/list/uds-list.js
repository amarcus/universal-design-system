const listSheet = new CSSStyleSheet();
let listStylesPromise = false;

let listTemplate = null;
let listTemplatePromise = false;

function ensureListStyles() {
    if (listStylesPromise) return listStylesPromise;

    listStylesPromise = (async () => {
        const cssUrl = new URL('./uds-list.css?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(cssUrl);
        const css = await response.text();
        await listSheet.replace(css);
    })();

    return listStylesPromise;
}

function ensureListTemplate() {
    if (listTemplatePromise) return listTemplatePromise;

    listTemplatePromise = (async () => {
        const htmlUrl = new URL('./uds-list.html?v=' + window.__DEV_BUILD__, import.meta.url);
        const response = await fetch(htmlUrl);
        const templateText = await response.text();

        listTemplate = document.createElement('template');
        listTemplate.innerHTML = templateText;
    })();

    return listTemplatePromise;
}

class UdsList extends HTMLElement {
    _list = null;
    _slot = null;
    _sections = [];

    _activeItem = null;
    _pendingItem = null;
    _switchTimer = null;
    _closeTimer = null;
    _pointerHistory = [];
    _maxPointerHistory = 6;

    static get observedAttributes() {
        return ['variant', 'type', 'multiple', 'mode', 'value'];
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
        this.addEventListener('uds-list-item-enter', this._onItemEnter);
        this.addEventListener('uds-list-item-activate', this._onItemActivate);

        this.constructor.observedAttributes.forEach(prop => {
            this._upgradeProperty(prop);
        });
    }

    disconnectedCallback() {
        this.removeEventListener('pointermove', this._onPointerMove);
        this.removeEventListener('pointerleave', this._onPointerLeave);
        this.removeEventListener('uds-list-item-enter', this._onItemEnter);
        this.removeEventListener('uds-list-item-activate', this._onItemActivate);

        this._clearTimers();
    }

    attributeChangedCallback() {
        this._updateState();
    }

    _ownsItem(item) {
        return item.closest('uds-list') === this;
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

        if (next && this._isInsideListTree(next)) {
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
        }, 120);
    }

    _cancelCloseAll() {
        if (this._closeTimer) {
            clearTimeout(this._closeTimer);
            this._closeTimer = null;
        }
    }

    _getRootList() {
        let node = this;
        let parentList = node.parentElement?.closest?.('uds-list');

        while (parentList) {
            node = parentList;
            parentList = node.parentElement?.closest?.('uds-list');
        }

        return node;
    }

    _isInsideListTree(node) {
        const root = this._getRootList();
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

    _getSublistByName(name) {
        if (!name) return null;

        const root = this._getRootList();
        return [...root.querySelectorAll('uds-list[sublist]')].find(list =>
            list.getAttribute('sublist') === name
        ) || null;
    }

    _getOpenSublistForItem(item) {
        if (!item?.hasAttribute('sublist')) return null;
        return this._getSublistByName(item.getAttribute('sublist'));
    }

    _positionSublist(item, sublist) {
        const itemRect = item.getBoundingClientRect();
        const rootRect = this._getRootList().getBoundingClientRect();
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const margin = 8;

        sublist.style.position = 'absolute';
        sublist.style.top = `${itemRect.top - rootRect.top + margin}px`;

        const sublistWidth = sublist.offsetWidth || sublist.getBoundingClientRect().width;

        const spaceRight = viewportWidth - itemRect.right;
        const spaceLeft = itemRect.left;

        const shouldOpenLeft = spaceRight < sublistWidth + margin && spaceLeft >= sublistWidth + margin;

        if (shouldOpenLeft) {
            sublist.style.left = `${itemRect.left - rootRect.left - sublistWidth + margin}px`;
        } else {
            sublist.style.left = `${itemRect.right - rootRect.left - margin}px`;
        }
    }

    _activateItem(item, { force = false } = {}) {
        const previous = this._activeItem;

        if (!force && previous === item) return;

        if (previous && previous !== item) {
            previous.removeAttribute('sublist-open');

            const prevSublist = this._getOpenSublistForItem(previous);
            
            if (prevSublist) {
                prevSublist.removeAttribute('open');
                prevSublist.style.top = '';
                prevSublist.style.left = '';
                prevSublist.style.position = '';
            }
        }

        this._activeItem = item;

        const sublist = this._getOpenSublistForItem(item);

        if (!sublist) {
            item.removeAttribute('sublist-open');
            return;
        }

        item.setAttribute('sublist-open', '');
        sublist.setAttribute('open', '');
        this._positionSublist(item, sublist);

        const root = this._getRootList();

        root.querySelectorAll('uds-list[sublist]').forEach(list => {
            if (list !== sublist) {
                list.removeAttribute('open');
                list.style.top = '';
                list.style.left = '';
                list.style.position = '';
            }
        });

        root.querySelectorAll('uds-list-item[sublist]').forEach(listItem => {
            if (listItem !== item) {
                listItem.removeAttribute('sublist-open');
            }
        });
    }

    selectItem(selectedItem) {
        if (this.multiple) {
            selectedItem.selected = !selectedItem.selected;
            this._syncValueFromSelection();
            return;
        }

        const ownerItem = this._getOwnerItemForSublist(selectedItem);
        const selectedList = selectedItem.closest('uds-list');

        if (ownerItem) {
            this._getOwnItems().forEach(item => {
                item.selected = item === ownerItem;
            });

            this._clearSublistSelections(selectedList);

            selectedList?.querySelectorAll('uds-list-item').forEach(item => {
                item.selected = item === selectedItem;
            });

            this.value = selectedItem.value || selectedItem.getAttribute('value') || '';

            return;
        }

        this._getOwnItems().forEach(item => {
            item.selected = item === selectedItem;
        });

        const sublist = selectedItem.hasAttribute('sublist')
            ? this._getSublistByName(selectedItem.getAttribute('sublist'))
            : null;

        this._clearSublistSelections(sublist);

        if (sublist) {
            const firstSublistItem = [...sublist.querySelectorAll('uds-list-item')].find(item =>
                item.closest('uds-list') === sublist
            );

            if (firstSublistItem) {
                firstSublistItem.selected = true;
            }
        }

        this.value = selectedItem.value || selectedItem.getAttribute('value') || '';
    }

    _clearSublistSelections(exceptList = null) {
        this.querySelectorAll('uds-list[sublist]').forEach(list => {
            if (list === exceptList) return;

            list.querySelectorAll('uds-list-item').forEach(item => {
                item.selected = false;
            });
        });
    }

    _getOwnItems() {
        return [...this.querySelectorAll('uds-list-item')].filter(item =>
            item.closest('uds-list') === this
        );
    }

    _getOwnerItemForSublist(selectedItem) {
        const selectedList = selectedItem.closest('uds-list');

        if (!selectedList || selectedList === this) {
            return null;
        }

        const sublistId = selectedList.getAttribute('sublist');

        if (!sublistId) {
            return null;
        }

        return this.querySelector(`uds-list-item[sublist="${CSS.escape(sublistId)}"]`);
    }

    closeAll() {
        this._clearTimers();
        this._pendingItem = null;
        this._activeItem = null;

        const root = this._getRootList();

        root.querySelectorAll('uds-list[sublist]').forEach(list => {
            list.removeAttribute('open');
            list.style.top = '';
            list.style.left = '';
            list.style.position = '';
        });

        root.querySelectorAll('uds-list-item[sublist]').forEach(item => {
            item.removeAttribute('sublist-open');
        });
    }

    _shouldDelayActivation(nextItem) {
        if (!this._activeItem) return false;
        if (nextItem === this._activeItem) return false;
        if (!this._activeItem.hasAttribute('sublist')) return false;

        const sublist = this._getOpenSublistForItem(this._activeItem);
        if (!sublist || !sublist.hasAttribute('open')) return false;

        const points = this._pointerHistory;
        if (points.length < 2) return false;

        const prev = points[points.length - 2];
        const curr = points[points.length - 1];
        const rect = sublist.getBoundingClientRect();
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
        if (!this.hasAttribute('type')) this.type = 'primary';
    }

    async _render() {
        if (!this.shadowRoot || this._list) return;

        await Promise.all([
            ensureListStyles(),
            ensureListTemplate()
        ]);

        this.shadowRoot.adoptedStyleSheets = [listSheet];
        this.shadowRoot.appendChild(listTemplate.content.cloneNode(true));

        this._list = this.shadowRoot.querySelector('.list');
        this._slot = this.shadowRoot.querySelector('slot');

        this._slot?.addEventListener('slotchange', () => this._collectSections());

        this._collectSections();
        this._resolveReady();
    }

    _collectSections() {
        if (!this._slot) return;

        this._sections = this._slot
            .assignedElements({ flatten: true })
            .filter(el => el.tagName.toLowerCase() === 'uds-list-section');

        this._syncSelectionFromValue();
        this._syncValueFromSelection();
        this._updateState();
    }

    _updateState() {
        if (!this._list) return;

        this._syncSelectionFromValue();

        if (this.mode === 'listbox' || this.mode === 'listbox-classic') {
            this._list.setAttribute('role', 'listbox');
            this._list.setAttribute('aria-multiselectable', String(this.multiple));
        } else {
            this._list.setAttribute('role', 'list');
            this._list.removeAttribute('aria-multiselectable');
        }

        this._sections.forEach((section, index) => {
            section.toggleAttribute('first-section', index === 0);
            section.toggleAttribute('last-section', index === this._sections.length - 1);
        });

        const items = this._getOwnItems();

        items.forEach(item => {
            item.variant = this.variant;
            item._updateState?.();
        });

        const sublists = [...this.children].filter(el =>
            el.tagName?.toLowerCase() === 'uds-list'
        );

        sublists.forEach(list => {
            list.variant = this.variant;

            if (!list.hasAttribute('type')) {
                list.type = this.type;
            }
        });
    }
    _getItemValue(item) {
        return item?.value || item?.getAttribute('value') || '';
    }

    _syncValueFromSelection() {
        const selectedItems = this._getOwnItems().filter(item => item.selected || item.hasAttribute('selected'));

        if (this.multiple) {
            this.setAttribute('value', selectedItems.map(item => this._getItemValue(item)).join(','));
            return;
        }

        const selectedItem = selectedItems[0];

        if (selectedItem) {
            this.setAttribute('value', this._getItemValue(selectedItem));
        }
    }

    _syncSelectionFromValue() {
        if (!this.hasAttribute('value')) return;

        const value = this.value;
        const values = this.multiple
            ? value.split(',').map(item => item.trim()).filter(Boolean)
            : [value];

        this._getOwnItems().forEach(item => {
            item.selected = values.includes(this._getItemValue(item));
        });
    }

    get variant() {
        return this.getAttribute('variant');
    }

    set variant(value) {
        this.setAttribute('variant', value);
    }

    get type() {
        return this.getAttribute('type');
    }

    set type(value) {
        this.setAttribute('type', value);
    }

    get mode() {
        return this.getAttribute('mode');
    }

    set mode(value) {
        this.setAttribute('mode', value);
    }

    get multiple() {
        return this.hasAttribute('multiple');
    }

    set multiple(value) {
        this.toggleAttribute('multiple', !!value);
    }

    get value() {
        return this.getAttribute('value') || '';
    }

    set value(value) {
        if (value === null || value === undefined || value === '') {
            this.removeAttribute('value');
        } else {
            this.setAttribute('value', value);
        }
    }
}

customElements.define('uds-list', UdsList);

export default UdsList;