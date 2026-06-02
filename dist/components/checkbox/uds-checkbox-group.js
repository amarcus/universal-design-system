class UdsCheckboxGroup extends HTMLElement {
    static get observedAttributes() {
        return ['type', 'size', 'disabled', 'horizontal', 'all-checked', 'value'];
    }

    constructor() {
        super();
        this._container = null;
        this._allCheckbox = null;
        this._onChange = this._onChange.bind(this);
        this._onAllCheckboxChange = this._onAllCheckboxChange.bind(this);
        this.attachShadow({ mode: 'open' });
        this._render();
    }

    connectedCallback() {
        this._upgradeProperty('type');
        this._upgradeProperty('size');
        this._upgradeProperty('disabled');
        this._upgradeProperty('horizontal');
        this._upgradeProperty('value');

        this.addEventListener('change', this._onChange);
        this._updateCheckboxes();
        this._updateCheckedStateFromValue();
    }

    disconnectedCallback() {
        this.removeEventListener('change', this._onChange);
    }

    attributeChangedCallback(name) {
        this._updateCheckboxes();
        
        if (name === 'value') {
            this._updateCheckedStateFromValue();
        }
    }
  
    _updateCheckedStateFromValue() {
        if (!this.hasAttribute('value')) return;
        
        const valueStr = this.getAttribute('value');
        
        if (!valueStr) return;
        
        const values = valueStr.split(',').map(v => v.trim());
        const checkboxes = this.querySelectorAll('uds-checkbox');
        
        checkboxes.forEach(checkbox => {
            const checkboxValue = checkbox.getAttribute('value');

            if (checkboxValue && values.includes(checkboxValue)) {
                checkbox.checked = true;
            }
        });
        
        if (this._allCheckbox) {
            this._updateAllCheckboxState();
        }
    }

    _upgradeProperty(prop) {
        if (this.hasOwnProperty(prop)) {
            const value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }

    async _render() {
        if (!this.shadowRoot) return;
        
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', new URL('./uds-checkbox-group.css' + '?t=' + new Date().getTime(), import.meta.url).href);
        this.shadowRoot.appendChild(linkElem);
        
        try {
            const response = await fetch(new URL('./uds-checkbox-group.html' + '?t=' + new Date().getTime(), import.meta.url).href);
            const templateText = await response.text();
            const template = document.createElement('template');
            template.innerHTML = templateText;
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            
            this._container = this.shadowRoot.querySelector('.checkbox-group');
            
            if (this.hasAttribute('all-checked')) {
                this._createAllCheckbox();
            }
            
            this._updateCheckboxes();
        } catch (error) {
            console.error('Failed to load checkbox group template:', error);
        }
    }
  
    _createAllCheckbox() {
        if (!this._container) return;
        
        if (this._allCheckbox) return;
        
        const allCheckboxContainer = document.createElement('div');
        allCheckboxContainer.classList.add('all-checkbox-container');
        
        this._allCheckbox = document.createElement('uds-checkbox');
        this._allCheckbox.setAttribute('value', 'all');
        this._allCheckbox.textContent = this.getAttribute('all-text') || '';
        
        if (this.hasAttribute('type')) {
            this._allCheckbox.setAttribute('type', this.getAttribute('type'));
        }
        
        if (this.hasAttribute('size')) {
            this._allCheckbox.setAttribute('size', this.getAttribute('size'));
        }
        
        this._allCheckbox.addEventListener('change', this._onAllCheckboxChange);
        
        allCheckboxContainer.appendChild(this._allCheckbox);
        this._container.insertBefore(allCheckboxContainer, this._container.firstChild);
        
        this._updateAllCheckboxState();
    }

    _updateCheckboxes() {
        if (!this._container) return;

        if (this.hasAttribute('horizontal')) {
            this._container.classList.add('horizontal');
        } else {
            this._container.classList.remove('horizontal');
        }
        
        const checkboxes = this.querySelectorAll('uds-checkbox');
        
        checkboxes.forEach(checkbox => {
            if (this.hasAttribute('type')) {
                checkbox.setAttribute('type', this.getAttribute('type'));
            }
            
            if (this.hasAttribute('size')) {
                checkbox.setAttribute('size', this.getAttribute('size'));
            }
            
            if (this.hasAttribute('disabled')) {
                checkbox.setAttribute('disabled', '');
            }
            
            if (this.hasAttribute('name')) {
                checkbox.setAttribute('name', this.getAttribute('name'));
            }
        });
    }

    _onChange(event) {
        if (event.target.tagName.toLowerCase() === 'uds-checkbox') {
            if (this._allCheckbox && event.target !== this._allCheckbox) {
                this._updateAllCheckboxState();
            }
            
            const changeEvent = new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: {
                    values: this.values
                }
            });

            this.dispatchEvent(changeEvent);
        }
    }
  
    _onAllCheckboxChange(event) {
        event.stopPropagation();
        
        const isChecked = event.target.checked;
        
        const checkboxes = Array.from(this.querySelectorAll('uds-checkbox')).filter(checkbox => 
            checkbox !== this._allCheckbox
        );
        
        checkboxes.forEach(checkbox => {
            if (!checkbox.disabled) {
                checkbox.checked = isChecked;
            }
        });
        
        this._allCheckbox.checked = isChecked;
        this._allCheckbox.indeterminate = false;
        
        setTimeout(() => {
            this._updateAllCheckboxState();
        }, 10);
        
        const changeEvent = new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: {
                values: this.values,
                allChecked: isChecked
            }
        });

        this.dispatchEvent(changeEvent);
    }
  
    _updateAllCheckboxState() {
        if (!this._allCheckbox) return;
        
        const checkboxes = Array.from(this.querySelectorAll('uds-checkbox')).filter(checkbox => 
            checkbox !== this._allCheckbox
        );
        
        let totalEnabled = 0;
        let totalCheckedEnabled = 0;
        let totalDisabled = 0;
        let totalCheckedDisabled = 0;
        
        checkboxes.forEach(checkbox => {
            if (checkbox.disabled) {
                totalDisabled++;

                if (checkbox.checked) {
                    totalCheckedDisabled++;
                }
            } else {
                totalEnabled++;

                if (checkbox.checked) {
                    totalCheckedEnabled++;
                }
            }
        });
        
        if (totalEnabled === 0) {
            this._allCheckbox.checked = totalCheckedDisabled === totalDisabled;
            this._allCheckbox.indeterminate = totalCheckedDisabled > 0 && totalCheckedDisabled < totalDisabled;
        } else {
            this._allCheckbox.checked = totalCheckedEnabled === totalEnabled;
        
            if (totalCheckedEnabled === totalEnabled && totalDisabled > 0 && totalCheckedDisabled < totalDisabled) {
                this._allCheckbox.indeterminate = true;
                this._allCheckbox.checked = false;
            } else {
                this._allCheckbox.indeterminate = totalCheckedEnabled > 0 && totalCheckedEnabled < totalEnabled;
            }
        }
    }

    get type() {
        return this.getAttribute('type') || 'primary';
    }
    
    set type(value) {
        this.setAttribute('type', value);
    }
    
    get size() {
        return this.getAttribute('size') || 'md';
    }
    
    set size(value) {
        this.setAttribute('size', value);
    }
    
    get disabled() {
        return this.hasAttribute('disabled');
    }
    
    set disabled(value) {
        if (value) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }
  
    get horizontal() {
        return this.hasAttribute('horizontal');
    }
  
    set horizontal(value) {
        if (value) {
            this.setAttribute('horizontal', '');
        } else {
            this.removeAttribute('horizontal');
        }
    }
    
    get name() {
        return this.getAttribute('name') || '';
    }
    
    set name(value) {
        this.setAttribute('name', value);
    }
  
    get allChecked() {
        return this.hasAttribute('all-checked');
    }
  
    set allChecked(value) {
        if (value) {
            this.setAttribute('all-checked', '');
            
            if (!this._allCheckbox) {
                this._createAllCheckbox();
            }
        } else {
            this.removeAttribute('all-checked');
            
            if (this._allCheckbox) {
                this._allCheckbox.parentNode.remove();
                this._allCheckbox = null;
            }
        }
    }
  
    get allText() {
        return this.getAttribute('all-text') || '';
    }
  
    set allText(value) {
        this.setAttribute('all-text', value);
        
        if (this._allCheckbox) {
            this._allCheckbox.textContent = value;
        }
    }
  
    get values() {
            const values = [];
            const checkboxes = this.querySelectorAll('uds-checkbox');
            
            checkboxes.forEach(checkbox => {
                if (checkbox.checked && checkbox.value !== 'all') {
                    values.push(checkbox.value);
                }
            });

        return values;
    }
}

customElements.define('uds-checkbox-group', UdsCheckboxGroup);

export { UdsCheckboxGroup };