function renderSettingsPanel(schema) {
    return schema.map(section => `
        <div class="panel-subtitle">${section.title}</div>
        ${section.fields.map(field => renderField(field)).join('')}
    `).join('');
}

function renderField(field) {
    if (field.type === 'checkbox-group') {
        return `
            <div class="panel-option">
                <div>${field.label || ''}</div>
                ${field.options.map(opt => `
                    <label>
                        <input
                            type="checkbox"
                            name="${field.id}"
                            value="${opt.value}"
                            ${opt.checked ? 'checked' : ''}
                        >
                        ${opt.label}
                    </label>
                `).join('')}
            </div>
        `;
    }

    if (field.type === 'radio-group') {
        return `
            <div class="panel-option">
                ${field.label ? `<div>${field.label}</div>` : ''}
                ${field.options.map(opt => `
                    <label>
                        <input
                            type="radio"
                            name="${field.id}"
                            value="${opt.value}"
                            ${opt.checked ? 'checked' : ''}
                        >
                        ${opt.label}
                    </label>
                `).join('')}
            </div>
        `;
    }

    if (field.type === 'checkbox') {
        return `
            <div class="panel-option">
                <label>
                    <input
                        type="checkbox"
                        id="${field.id}"
                        name="${field.id}"
                        ${field.checked ? 'checked' : ''}
                    >
                    ${field.label}
                </label>
            </div>
        `;
    }

    if (field.type === 'text') {
        return `
            <div class="panel-option">
                ${field.label ? `<label for="${field.id}">${field.label}</label>` : ''}
                <input
                    type="text"
                    id="${field.id}"
                    name="${field.id}"
                    value="${field.value ?? ''}"
                >
            </div>
        `;
    }

    if (field.type === 'select') {
        return `
            <div class="panel-option">
                ${field.label ? `<label for="${field.id}">${field.label}</label>` : ''}
                <select id="${field.id}" name="${field.id}">
                    ${(field.options || []).map(opt => `
                        <option value="${opt.value}" ${opt.value === field.value ? 'selected' : ''}>
                            ${opt.label}
                        </option>
                    `).join('')}
                </select>
            </div>
        `;
    }

    return '';
}

function mountSettingsPanel() {
    document.body.insertAdjacentHTML('beforeend', `
        <div class="panel-open">Settings</div>

        <div class="panel">
            <div class="panel-title">Settings</div>
            <div class="panel-close">×</div>
            <div class="panel-controls"></div>
        </div>
    `);
}

function applyInitialVisibilityFromSchema(schema) {
    schema.forEach(section => {
        section.fields.forEach(field => {
            if (!field.visibleIf) return;

            const controller = document.getElementById(field.visibleIf);
            const target = document.getElementById(field.id);

            if (!controller || !target) return;

            const wrapper = target.closest('.panel-option');
            if (!wrapper) return;

            wrapper.style.display = isFieldVisible(field, controller) ? '' : 'none';
        });
    });
}

function isFieldVisible(field, controller) {
    if (field.visibleIfValue !== undefined) {
        return controller.value === field.visibleIfValue;
    }

    if (controller.type === 'checkbox') {
        return controller.checked;
    }

    return !!controller.value;
}

mountSettingsPanel();

document.querySelector('.panel-controls').innerHTML = renderSettingsPanel(uds_schema);

applyInitialVisibilityFromSchema(uds_schema);

const settingsPanel = document.querySelector('.panel');
const settingsPanelClose = document.querySelector('.panel-close');
const settingsPanelOpen = document.querySelector('.panel-open');

settingsPanelClose.addEventListener('click', () => {
    settingsPanel.classList.add('panel--hidden');
});

settingsPanelOpen.addEventListener('click', () => {
    settingsPanel.classList.remove('panel--hidden');
});

const themeRadios = document.querySelectorAll('input[name="theme"]');

function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.style.colorScheme = 'light';
    } else if (theme === 'dark') {
        document.documentElement.style.colorScheme = 'dark';
    } else {
        document.documentElement.style.colorScheme = 'light dark';
    }
}

document.querySelector('.panel-controls').addEventListener('change', () => {
    applyInitialVisibilityFromSchema(uds_schema);
});

themeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        applyTheme(radio.value);
    });
});

applyTheme('auto');


const sizeCheckboxes = document.querySelectorAll('input[name="component-size"]');
const styleCheckboxes = document.querySelectorAll('input[name="component-style"]');
const typeCheckboxes = document.querySelectorAll('input[name="component-type"]');
const levelCheckboxes = document.querySelectorAll('input[name="component-levels"]');
const modeSelect = document.getElementById('component-mode');

sizeCheckboxes.forEach(cb => {
    cb.addEventListener('change', onSizeChange);
});

styleCheckboxes.forEach(cb => {
    cb.addEventListener('change', onStyleChange);
});

typeCheckboxes.forEach(cb => {
    cb.addEventListener('change', onTypeChange);
});

levelCheckboxes.forEach(cb => {
    cb.addEventListener('change', onLevelChange);
});

modeSelect?.addEventListener('change', onModeChange);

function onSizeChange() {
    const small = document.querySelector('input[name="component-size"][value="small"]').checked;
    const medium = document.querySelector('input[name="component-size"][value="medium"]').checked;
    const large = document.querySelector('input[name="component-size"][value="large"]').checked;

    const smallCells = document.querySelectorAll('div[data-cell="small"]');
    const mediumCells = document.querySelectorAll('div[data-cell="medium"]');
    const largeCells = document.querySelectorAll('div[data-cell="large"]');

    smallCells.forEach((cell) => cell.style.display = small ? '' : 'none');
    mediumCells.forEach((cell) => cell.style.display = medium ? '' : 'none');
    largeCells.forEach((cell) => cell.style.display = large ? '' : 'none');

    if (document.body.id == 'page-segment') {
        document.querySelector('.header div[data-group="small"]').style.display = small ? '' : 'none';
        document.querySelector('.header div[data-group="medium"]').style.display = medium ? '' : 'none';
        document.querySelector('.header div[data-group="large"]').style.display = large ? '' : 'none';
    }

    updateTable();
}

function onStyleChange() {
    const visibleStyles = {
        filled: document.querySelector('input[name="component-style"][value="filled"]').checked,
        outline: document.querySelector('input[name="component-style"][value="outline"]').checked,
        ghost: document.querySelector('input[name="component-style"][value="ghost"]').checked,
        text: document.querySelector('input[name="component-style"][value="text"]').checked
    };

    if (document.body.id != 'page-menu' && document.body.id != 'page-list') {
        const periods = document.querySelectorAll('.period');

        periods.forEach(period => {
            const type = period.getAttribute('data-period');
            period.style.display = visibleStyles[type] ? '' : 'none';
        });
    } else {
        const columns = document.querySelectorAll('.flex-list-column');

        columns.forEach(column => {
            const type = column.getAttribute('data-column');
            column.style.display = visibleStyles[type] ? '' : 'none';
        });
    }
}

function onTypeChange() {
    const visibleTypes = {
        primary: document.querySelector('input[name="component-type"][value="primary"]')?.checked ?? false,
        secondary: document.querySelector('input[name="component-type"][value="secondary"]')?.checked ?? false,
        danger: document.querySelector('input[name="component-type"][value="danger"]')?.checked ?? false
    };

    if (document.body.id == 'page-list') {
        const lists = document.querySelectorAll('.flex-list');

        if (lists[0]) lists[0].style.display = visibleTypes.primary ? '' : 'none';
        if (lists[1]) lists[1].style.display = visibleTypes.secondary ? '' : 'none';
        if (lists[2]) lists[2].style.display = visibleTypes.danger ? '' : 'none';

        updateTable();
        return;
    }

    if (document.body.id != 'page-segment') {
        document.querySelectorAll('.row').forEach(row => {
            const groups = row.querySelectorAll('.group');

            if (groups[0]) groups[0].style.display = visibleTypes.primary ? '' : 'none';
            if (groups[1]) groups[1].style.display = visibleTypes.secondary ? '' : 'none';
            if (groups[2]) groups[2].style.display = visibleTypes.danger ? '' : 'none';
        });
    } else {
        const pgroups = document.querySelectorAll('.period-group');

        if (pgroups[0]) pgroups[0].style.display = visibleTypes.primary ? '' : 'none';
        if (pgroups[1]) pgroups[1].style.display = visibleTypes.secondary ? '' : 'none';
        if (pgroups[2]) pgroups[2].style.display = visibleTypes.danger ? '' : 'none';
    }

    updateTable();
}

function onLevelChange() {
    if (document.body.id !== 'page-tabs') return;

    const visibleLevels = {
        browser: document.querySelector('input[name="component-levels"][value="l1"]')?.checked ?? false,
        body: document.querySelector('input[name="component-levels"][value="l2"]')?.checked ?? false,
        section: document.querySelector('input[name="component-levels"][value="l3"]')?.checked ?? false,
        panel: document.querySelector('input[name="component-levels"][value="l4"]')?.checked ?? false
    };

    document.querySelectorAll('#page-tabs .period .row:not(.header)').forEach(row => {
        const tabs = row.querySelector('uds-tabs');
        if (!tabs) return;

        const level = tabs.getAttribute('level');
        row.style.display = visibleLevels[level] ? '' : 'none';
    });

    updateTable();
}

function onModeChange() {
    if (document.body.id !== 'page-list') return;

    const selectedMode = modeSelect?.value || 'dropdown';

    if (selectedMode !== 'dropdown' && nestedCheckbox?.checked) {
        nestedCheckbox.checked = false;
        onNestedChange('hide');
    }

    document.querySelectorAll('uds-list').forEach(list => {
        if (selectedMode === 'dropdown') {
            list.removeAttribute('mode');
        } else {
            list.setAttribute('mode', selectedMode);
        }
    });

    updateTable();
}

const labelCheckbox = document.getElementById('component-label');
const labelInput = document.getElementById('component-label-value');
const leftIconCheckbox = document.getElementById('component-left-icon');
const leftIconSelect = document.getElementById('lefticon');
const rightIconCheckbox = document.getElementById('component-right-icon');
const rightIconSelect = document.getElementById('righticon');
const topIconCheckbox = document.getElementById('component-top-icon');
const topIconSelect = document.getElementById('topicon');
const leftIconsCheckbox = document.getElementById('component-left-icons');
const rightIconsCheckbox = document.getElementById('component-right-icons');
const rightButtonCheckbox = document.getElementById('component-right-button');
const rightButton1Checkbox = document.getElementById('component-right-button-1');
const rightButton2Checkbox = document.getElementById('component-right-button-2');
const button1Checkbox = document.getElementById('component-button-1');
const button2Checkbox = document.getElementById('component-button-2');
const rightButtonSelect = document.getElementById('rightbutton');
const clearButtonCheckbox = document.getElementById('component-clear-button');
const counterCheckbox = document.getElementById('component-counter');
const counterInput = document.getElementById('component-counter-value');
const shortcutsCheckbox = document.getElementById('component-shortcuts');
const noteCheckbox = document.getElementById('component-note');
const noteInput = document.getElementById('component-note-value');
const draggerCheckbox = document.getElementById('component-dragger');
const nestedCheckbox = document.getElementById('component-nested');
const sectionStyle = document.getElementById('component-section-style');
const checkmarkCheckbox = document.getElementById('component-checkmark');
const exclusiveCheckbox = document.getElementById('component-exclusive');
const descriptionCheckbox = document.getElementById('component-description');
const descriptionInput = document.getElementById('component-description-value');
const placeholderInput = document.getElementById('component-placeholder-value');
const inputTypeSelect = document.getElementById('component-input-type');

const buttonsNumber = document.getElementById('component-buttons-number');
const tabsNumber = document.getElementById('component-tabs-number');
const inputWidth = document.getElementById('component-label-width');
const indeterminateCheckbox = document.getElementById('component-indeterminate');
const disabledCheckbox = document.getElementById('component-disabled');
const disabledLeftCheckbox = document.getElementById('component-disabled-left');
const disabledRightCheckbox = document.getElementById('component-disabled-right');
const readonlyCheckbox = document.getElementById('component-readonly');
const loadingCheckbox = document.getElementById('component-loading');
const roundCheckbox = document.getElementById('component-round');
const scaleCheckbox = document.getElementById('component-scale');

labelCheckbox?.addEventListener('change', onLabelChange);
labelInput?.addEventListener('input', onLabelInputChange);
leftIconCheckbox?.addEventListener('change', onLeftIconChange);
leftIconSelect?.addEventListener('change', onLeftIconDropdownChange);
rightIconCheckbox?.addEventListener('change', onRightIconChange);
rightIconSelect?.addEventListener('change', onRightIconDropdownChange);
topIconCheckbox?.addEventListener('change', onTopIconChange);
topIconSelect?.addEventListener('change', onTopIconDropdownChange);
leftIconsCheckbox?.addEventListener('change', onLeftIconsChange);
rightIconsCheckbox?.addEventListener('change', onRightIconsChange);
rightButtonCheckbox?.addEventListener('change', onRightButtonChange);
rightButton1Checkbox?.addEventListener('change', onRightButtonChange);
rightButton2Checkbox?.addEventListener('change', onRightButtonChange);
rightButtonSelect?.addEventListener('change', onRightButtonDropdownChange);
button1Checkbox?.addEventListener('change', () => onListItemButtonChange('button-1', button1Checkbox.checked));
button2Checkbox?.addEventListener('change', () => onListItemButtonChange('button-2', button2Checkbox.checked));
clearButtonCheckbox?.addEventListener('change', onClearButtonChange);
counterCheckbox?.addEventListener('change', onCounterChange);
counterInput?.addEventListener('input', onCounterInputChange);
shortcutsCheckbox?.addEventListener('change', onShortcutsChange);
noteCheckbox?.addEventListener('change', onNoteChange);
noteInput?.addEventListener('input', onNoteInputChange);
draggerCheckbox?.addEventListener('change', onDraggerChange);
nestedCheckbox?.addEventListener('change', onNestedChange);
sectionStyle?.addEventListener('change', onSectionStyleChange);
exclusiveCheckbox?.addEventListener('change', onExclusiveChange);
checkmarkCheckbox?.addEventListener('change', onCheckmarkChange);
descriptionCheckbox?.addEventListener('change', onDescriptionChange);
descriptionInput?.addEventListener('input', onDescriptionInputChange);
placeholderInput?.addEventListener('input', onPlaceholderInputChange);
inputTypeSelect?.addEventListener('input', onInputTypeChange);

buttonsNumber?.addEventListener('change', onButtonsNumberChange);
tabsNumber?.addEventListener('change', onTabsNumberChange);
inputWidth?.addEventListener('input', onInputWidthChange);
indeterminateCheckbox?.addEventListener('change', onIndeterminateChange);
disabledCheckbox?.addEventListener('change', onDisabledChange);
disabledLeftCheckbox?.addEventListener('change', onDisabledLeftChange);
disabledRightCheckbox?.addEventListener('change', onDisabledRightChange);
readonlyCheckbox?.addEventListener('change', onReadonlyChange);
loadingCheckbox?.addEventListener('change', onLoadingChange);
roundCheckbox?.addEventListener('change', onRoundChange);
scaleCheckbox?.addEventListener('change', onScaleChange);

function updateTable() {
    if (document.body.id == 'page-segment') {
        updateSegmentTable();
    } else {
        updateStandardTable();
    }
}

function updateStandardTable() {
    const getVisibleComponentWidth = (size) => {
        const cells = Array.from(
            document.querySelectorAll(`div[data-period="filled"] div[data-group="primary"] div[data-cell="${size}"]`)
        );

        const visibleCell = cells.find(cell => cell.offsetParent !== null);
        if (!visibleCell) return null;

        const component = visibleCell.querySelector(uds_component);
        if (!component) return null;

        return component.getBoundingClientRect().width;
    };

    const componentSmallWidth = getVisibleComponentWidth('small');
    const componentMediumWidth = getVisibleComponentWidth('medium');
    const componentLargeWidth = getVisibleComponentWidth('large');

    const smallCells = document.querySelectorAll('div[data-cell="small"]');
    const mediumCells = document.querySelectorAll('div[data-cell="medium"]');
    const largeCells = document.querySelectorAll('div[data-cell="large"]');

    if (componentSmallWidth != null) {
        smallCells.forEach(cell => {
            cell.style.width = `${componentSmallWidth}px`;
        });
    }

    if (componentMediumWidth != null) {
        mediumCells.forEach(cell => {
            cell.style.width = `${componentMediumWidth}px`;
        });
    }

    if (componentLargeWidth != null) {
        largeCells.forEach(cell => {
            cell.style.width = `${componentLargeWidth}px`;
        });
    }
}

function updateSegmentTable() {
    const componentSmallWidth = document.querySelector(
        `div[data-period="filled"] div[data-group="primary"] div[data-cell="small"] uds-segment`
    ).getBoundingClientRect().width;

    const componentMediumWidth = document.querySelector(
        `div[data-period="filled"] div[data-group="primary"] div[data-cell="medium"] uds-segment`
    ).getBoundingClientRect().width;

    const componentLargeWidth = document.querySelector(
        `div[data-period="filled"] div[data-group="primary"] div[data-cell="large"] uds-segment`
    ).getBoundingClientRect().width;

    const smallCells = document.querySelectorAll('.header div[data-group="small"]');
    const mediumCells = document.querySelectorAll('.header div[data-group="medium"]');
    const largeCells = document.querySelectorAll('.header div[data-group="large"]');

    smallCells.forEach(cell => {
        cell.style.width = `${componentSmallWidth}px`;
    });

    mediumCells.forEach(cell => {
        cell.style.width = `${componentMediumWidth}px`;
    });

    largeCells.forEach(cell => {
        cell.style.width = `${componentLargeWidth}px`;
    });
}

lucide.createIcons();





function onLabelChange() {
    const show = labelCheckbox.checked;

    if (document.body.id === 'page-segment') {
        document.querySelectorAll('uds-segment').forEach(segment => {
            segment.querySelectorAll('uds-button').forEach(button => {
                if (show) {
                    button.showLabel();
                } else {
                    button.hideLabel();
                }
            });
        });

        labelInput.style.display = show ? '' : 'none';
        updateTable();
        return;
    }

    if (document.body.id === 'page-split-button') {
        document.querySelectorAll('uds-split-button').forEach(splitButton => {
            const button = splitButton.querySelector('uds-button');

            if (!button) return;

            if (show) {
                button.showLabel();
            } else {
                button.hideLabel();
            }
        });

        labelInput.style.display = show ? '' : 'none';
        updateTable();
        return;
    }

    if (document.body.id === 'page-tabs') {
        document.querySelectorAll('uds-tab').forEach(tab => {
            if (show) {
                tab.showLabel();
            } else {
                tab.hideLabel();
            }
        });

        labelInput.style.display = show ? '' : 'none';
        updateTable();
        return;
    }

    document.querySelectorAll(uds_component).forEach(component => {
        if (show) {
            component.showLabel();
        } else {
            component.hideLabel();
        }
    });

    labelInput.style.display = show ? '' : 'none';
    updateTable();
}

function onLabelInputChange() {
    const value = labelInput.value;
    const isSegment = document.body.id === 'page-segment';
    const isSplitButton = document.body.id === 'page-split-button';

    if (isSplitButton) {
        document.querySelectorAll('uds-split-button').forEach(splitButton => {
            const button = splitButton.querySelector('uds-button');

            if (button) {
                button.label = value;
            }
        });

        updateTable();
        return;
    }

    if (document.body.id === 'page-tabs') {
        const parts = value.split(',').map(v => v.trim());

        document.querySelectorAll('uds-tabs').forEach(tabs => {
            const tabItems = tabs.querySelectorAll('uds-tab');

            tabItems.forEach((tab, index) => {
                tab.label = parts[index] || `Item ${index + 1}`;
            });
        });

        updateTable();
        return;
    }

    if (!isSegment) {
        document.querySelectorAll(uds_component).forEach(component => {
            component.label = value;
        });

        updateTable();
        return;
    }

    const parts = value.split(',').map(v => v.trim());

    document.querySelectorAll('uds-segment').forEach(segment => {
        const buttons = segment.querySelectorAll('uds-button');

        buttons.forEach((button, index) => {
            button.label = parts[index] ?? '';
        });
    });

    updateTable();
}

function onLeftIconChange() {
    const show = document.getElementById('component-left-icon').checked;

    if (document.body.id === 'page-segment') {
        document.querySelectorAll('uds-segment').forEach(segment => {
            segment.querySelectorAll('uds-button').forEach(button => {
                if (show) {
                    let icon = button.querySelector('[slot="icon"]');

                    if (!icon) {
                        icon = document.createElement('i');
                        icon.setAttribute('slot', 'icon');
                        icon.setAttribute('data-lucide', leftIconSelect.value);
                        button.prepend(icon);
                    }

                    button.showLeftIcon();
                } else {
                    const icon = button.querySelector('[slot="icon"]');
                    if (icon) icon.remove();

                    button.hideLeftIcon();
                }
            });
        });
    } else if (document.body.id === 'page-split-button') {
        document.querySelectorAll('uds-split-button').forEach(splitButton => {
            const button = splitButton.querySelector('uds-button');
            if (!button) return;

            if (show) {
                let icon = button.querySelector('[slot="icon"]');

                if (!icon) {
                    icon = document.createElement('i');
                    icon.setAttribute('slot', 'icon');
                    icon.setAttribute('data-lucide', leftIconSelect.value);
                    button.prepend(icon);
                }

                button.showLeftIcon();
            } else {
                const icon = button.querySelector('[slot="icon"]');
                if (icon) icon.remove();

                button.hideLeftIcon();
            }
        });
    } else if (document.body.id === 'page-tabs') {
        document.querySelectorAll('uds-tab').forEach(tab => {
            if (show) {
                let icon = Array.from(tab.children)
                    .find(child => child.getAttribute('slot') === 'icon');

                if (!icon) {
                    icon = document.createElement('i');
                    icon.setAttribute('slot', 'icon');
                    icon.setAttribute('data-lucide', leftIconSelect.value);
                    tab.insertBefore(icon, tab.firstChild);
                }

                tab.showLeftIcon();
            } else {
                const icon = Array.from(tab.children)
                    .find(child => child.getAttribute('slot') === 'icon');

                if (icon) icon.remove();

                tab.hideLeftIcon();
            }
        });
    } else {
        document.querySelectorAll(uds_component).forEach(component => {
            if (show) {
                component.showLeftIcon();
            } else {
                component.hideLeftIcon();
            }
        });
    }

    lucide.createIcons();
    updateTable();
}

function onRightIconChange(forced) {
    const show = document.getElementById('component-right-icon').checked;

    if (document.body.id === 'page-segment') {
        document.querySelectorAll('uds-segment').forEach(segment => {
            segment.querySelectorAll('uds-button').forEach(button => {
                if (show) {
                    let icon = button.querySelector('[slot="icon-right"]');

                    if (!icon) {
                        icon = document.createElement('i');
                        icon.setAttribute('slot', 'icon-right');
                        icon.setAttribute('data-lucide', rightIconSelect.value);
                        button.appendChild(icon);
                    }

                    button.showRightIcon();
                } else {
                    const icon = button.querySelector('[slot="icon-right"]');
                    if (icon) icon.remove();

                    button.hideRightIcon();
                }
            });
        });
    } else if (document.body.id === 'page-split-button') {
        document.querySelectorAll('uds-split-button').forEach(splitButton => {
            const button = splitButton.querySelector('uds-button');
            if (!button) return;

            if (show) {
                let icon = button.querySelector('[slot="icon-right"]');

                if (!icon) {
                    icon = document.createElement('i');
                    icon.setAttribute('slot', 'icon-right');
                    icon.setAttribute('data-lucide', rightIconSelect.value);
                    button.appendChild(icon);
                }

                button.showRightIcon();
            } else {
                const icon = button.querySelector('[slot="icon-right"]');
                if (icon) icon.remove();

                button.hideRightIcon();
            }
        });
    } else if (document.body.id === 'page-tabs') {
        document.querySelectorAll('uds-tab').forEach(tab => {
            if (show) {
                let icon = Array.from(tab.children)
                    .find(child => child.getAttribute('slot') === 'icon-right');

                if (!icon) {
                    icon = document.createElement('i');
                    icon.setAttribute('slot', 'icon-right');
                    icon.setAttribute('data-lucide', rightIconSelect.value);

                    const button = Array.from(tab.children)
                        .find(child => child.getAttribute('slot') === 'button');

                    tab.insertBefore(icon, button || null);
                }

                tab.showRightIcon();
            } else {
                const icon = Array.from(tab.children)
                    .find(child => child.getAttribute('slot') === 'icon-right');

                if (icon) icon.remove();

                tab.hideRightIcon();
            }
        });
    } else if (document.body.id == 'page-menu' || document.body.id == 'page-list') {
        var selector = (document.body.id == 'page-menu') ? 'uds-menu-item' : 'uds-list-item';

        document.querySelectorAll(selector).forEach(component => {
            if (forced == 'show') {
                component.showRightIcon();
            } else if (forced == 'hide') {
                component.hideRightIcon();
            } else {
                if (show) {
                    component.showRightIcon();
                } else {
                    component.hideRightIcon();
                }
            }
        });
    } else {
        document.querySelectorAll(uds_component).forEach(component => {
            if (show) {
                component.showRightIcon();
            } else {
                component.hideRightIcon();
            }
        });
    }

    lucide.createIcons();
    updateTable();
}

function onRightIconsChange(forced) {
    const show = document.getElementById('component-right-icons').checked;

    if (document.body.id == 'page-menu' || document.body.id == 'page-list') {
        var selector = (document.body.id == 'page-menu') ? 'uds-menu-item' : 'uds-list-item';

        document.querySelectorAll(selector).forEach(component => {
            if (forced == 'show') {
                component.showRightIcon();
            } else if (forced == 'hide') {
                component.hideRightIcon();
            } else {
                if (show) {
                    component.showRightIcon();
                } else {
                    component.hideRightIcon();
                }
            }
        });
    }

    lucide.createIcons();
    updateTable();
}

function onLeftIconsChange(forced) {
    const checked = document.getElementById('component-left-icons').checked;
    const shouldShow = forced === 'show' ? true : forced === 'hide' ? false : checked;

    if (document.body.id == 'page-menu') {
        document.querySelectorAll('uds-menu-item').forEach(component => {
            const hasLeftIcon = !!component.getLeftIconElement();
            const section = component.closest('uds-menu-section');
            const hasCheckmarkColumn = section?.getAttribute('section-type') !== 'actions';

            if (shouldShow) {
                component.showLeftIcon();

                if (!hasLeftIcon && !hasCheckmarkColumn) {
                    component.setAttribute('empty-icon', '');
                } else {
                    component.removeAttribute('empty-icon');
                }
            } else {
                component.hideLeftIcon();
                component.removeAttribute('empty-icon');
            }
        });
    }

    if (document.body.id == 'page-list') {
        document.querySelectorAll('uds-list-item').forEach(component => {
            const hasLeftIcon = !!component.getLeftIconElement();
            const section = component.closest('uds-list-section');
            const hasCheckmarkColumn = section?.getAttribute('checkmark') !== 'none';

            if (shouldShow) {
                component.showLeftIcon();

                if (!hasLeftIcon && !hasCheckmarkColumn) {
                    component.setAttribute('empty-icon', '');
                } else {
                    component.removeAttribute('empty-icon');
                }
            } else {
                component.hideLeftIcon();
                component.removeAttribute('empty-icon');
            }
        });
    }

    lucide.createIcons();
    updateTable();
}

function onRightButtonChange() {
    if (document.body.id === 'page-tabs') {
        const showLevel1 = rightButton1Checkbox?.checked ?? true;
        const showLevel2Plus = rightButton2Checkbox?.checked ?? true;

        document.querySelectorAll('uds-tabs').forEach(tabs => {
            const level = tabs.getAttribute('level');
            const isLevel1 = level === 'browser' || level === 'l1' || level === '1';
            const show = isLevel1 ? showLevel1 : showLevel2Plus;

            tabs.querySelectorAll('uds-tab').forEach(tab => {
                if (show) {
                    tab.showButton();
                } else {
                    tab.hideButton();
                }
            });
        });

        updateTable();
        return;
    }

    const show = document.getElementById('component-right-button').checked;

    document.querySelectorAll(uds_component).forEach(component => {
        if (show) {
            component.showRightButton();
        } else {
            component.hideRightButton();
        }
    });

    updateTable();
}

function onListItemButtonChange(slotName, show) {
    document.querySelectorAll('uds-list-item').forEach(item => {
        const button = item.querySelector(`[slot="${slotName}"]`);
        if (!button) return;

        button.style.display = show ? '' : 'none';
    });

    updateTable();
}

function onClearButtonChange() {
    const show = document.getElementById('component-clear-button').checked;

    document.querySelectorAll(uds_component).forEach(component => {
        const existing = component.querySelector('[slot="clear-button"]');

        if (show) {
            if (!existing) {
                const button = document.createElement('uds-button');
                button.setAttribute('slot', 'clear-button');
                button.setAttribute('type', 'secondary');
                button.setAttribute('variant', 'text');
                button.setAttribute('size', 'small');

                const icon = document.createElement('i');
                icon.setAttribute('slot', 'icon');
                icon.setAttribute('data-lucide', 'circle-x');

                button.appendChild(icon);
                component.appendChild(button);
            }
        } else {
            existing?.remove();
        }

        component._onSuffixSlotsChange?.();
        component._updateState?.();
    });

    lucide.createIcons();
    updateTable();
}

function onLeftIconDropdownChange() {
    const iconName = leftIconSelect.value;

    if (document.body.id === 'page-segment') {
        document.querySelectorAll('uds-segment').forEach(segment => {
            segment.querySelectorAll('uds-button').forEach(button => {
                let icon = button.querySelector('[slot="icon"]');

                if (!icon) {
                    icon = document.createElement('i');
                    icon.setAttribute('slot', 'icon');
                    button.prepend(icon);
                }

                icon.setAttribute('data-lucide', iconName);
            });
        });
    } else if (document.body.id === 'page-split-button') {
        document.querySelectorAll('uds-split-button').forEach(splitButton => {
            const button = splitButton.querySelector('uds-button');
            if (!button) return;

            let icon = button.querySelector('[slot="icon"]');

            if (!icon) {
                icon = document.createElement('i');
                icon.setAttribute('slot', 'icon');
                button.prepend(icon);
            }

            icon.setAttribute('data-lucide', iconName);
        });
    } else if (document.body.id === 'page-tabs') {
        document.querySelectorAll('uds-tab').forEach(tab => {
            let icon = Array.from(tab.children)
                .find(child => child.getAttribute('slot') === 'icon');

            if (!icon) {
                icon = document.createElement('i');
                icon.setAttribute('slot', 'icon');
                tab.insertBefore(icon, tab.firstChild);
            }

            icon.setAttribute('data-lucide', iconName);
            tab.showLeftIcon();
        });
    } else {
        document.querySelectorAll(uds_component).forEach(component => {
            const icon = component.getLeftIconElement();

            if (icon) {
                icon.setAttribute('data-lucide', iconName);
            }
        });
    }

    lucide.createIcons();
    updateTable();
}


function onRightIconDropdownChange() {
    const iconName = rightIconSelect.value;

    if (document.body.id === 'page-segment') {
        document.querySelectorAll('uds-segment').forEach(segment => {
            segment.querySelectorAll('uds-button').forEach(button => {
                let icon = button.querySelector('[slot="icon-right"]');

                if (!icon) {
                    icon = document.createElement('i');
                    icon.setAttribute('slot', 'icon-right');
                    button.appendChild(icon);
                }

                icon.setAttribute('data-lucide', iconName);
            });
        });
    } else if (document.body.id === 'page-split-button') {
        document.querySelectorAll('uds-split-button').forEach(splitButton => {
            const button = splitButton.querySelector('uds-button');
            if (!button) return;

            let icon = button.querySelector('[slot="icon-right"]');

            if (!icon) {
                icon = document.createElement('i');
                icon.setAttribute('slot', 'icon-right');
                button.appendChild(icon);
            }

            icon.setAttribute('data-lucide', iconName);
        });
    } else if (document.body.id === 'page-tabs') {
        document.querySelectorAll('uds-tab').forEach(tab => {
            let icon = Array.from(tab.children)
                .find(child => child.getAttribute('slot') === 'icon-right');

            if (!icon) {
                icon = document.createElement('i');
                icon.setAttribute('slot', 'icon-right');

                const button = Array.from(tab.children)
                    .find(child => child.getAttribute('slot') === 'button');

                tab.insertBefore(icon, button || null);
            }

            icon.setAttribute('data-lucide', iconName);
            tab.showRightIcon();
        });
    } else {
        document.querySelectorAll(uds_component).forEach(component => {
            const icon = component.getRightIconElement();

            if (icon) {
                icon.setAttribute('data-lucide', iconName);
            }
        });
    }

    lucide.createIcons();
    updateTable();
}

function onTopIconChange() {
    if (document.body.id !== 'page-tabs') return;

    const show = topIconCheckbox.checked;

    document.querySelectorAll('uds-tabs[level="body"], uds-tabs[level="l2"], uds-tabs[level="2"]').forEach(tabs => {
        tabs.querySelectorAll('uds-tab').forEach(tab => {
            if (show) {
                let icon = tab.querySelector('[slot="icon-top"]');

                if (!icon) {
                    icon = document.createElement('i');
                    icon.setAttribute('slot', 'icon-top');
                    icon.setAttribute('data-lucide', topIconSelect.value);
                    tab.prepend(icon);
                }

                tab.showTopIcon();
            } else {
                const icon = tab.querySelector('[slot="icon-top"]');
                if (icon) icon.remove();

                tab.hideTopIcon();
            }
        });
    });

    lucide.createIcons();
    updateTable();
}

function onTopIconDropdownChange() {
    if (document.body.id !== 'page-tabs') return;

    const iconName = topIconSelect.value;

    document.querySelectorAll('uds-tabs[level="body"], uds-tabs[level="l2"], uds-tabs[level="2"]').forEach(tabs => {
        tabs.querySelectorAll('uds-tab').forEach(tab => {
            let icon = tab.querySelector('[slot="icon-top"]');

            if (!icon) {
                icon = document.createElement('i');
                icon.setAttribute('slot', 'icon-top');
                tab.prepend(icon);
            }

            icon.setAttribute('data-lucide', iconName);
            tab.showTopIcon();
        });
    });

    lucide.createIcons();
    updateTable();
}

function onRightButtonDropdownChange() {
    const iconName = rightButtonSelect.value;

    document.querySelectorAll(uds_component).forEach(component => {
        const icon = component.getRightButtonElement();

        if (icon) {
            icon.setAttribute('data-lucide', iconName);
        }
    });

    lucide.createIcons();
    updateTable();
}

function onCounterChange() {
    const show = counterCheckbox.checked;

    if (document.body.id === 'page-segment') {
        const value = counterInput.value;

        document.querySelectorAll('uds-segment').forEach(segment => {
            segment.querySelectorAll('uds-button').forEach(button => {
                if (show) {
                    button.counter = value;
                    button.showCounter();
                } else {
                    button.counter = '';
                    button.hideCounter();
                }
            });
        });

        counterInput.style.display = show ? '' : 'none';
        updateTable();
        return;
    }

    if (document.body.id === 'page-split-button') {
        const value = counterInput.value;

        document.querySelectorAll('uds-split-button').forEach(splitButton => {
            const button = splitButton.querySelector('uds-button');
            if (!button) return;

            if (show) {
                button.counter = value;
                button.showCounter();
            } else {
                button.counter = '';
                button.hideCounter();
            }
        });

        counterInput.style.display = show ? '' : 'none';
        updateTable();
        return;
    }

    if (document.body.id === 'page-tabs') {
        const value = counterInput.value;

        document.querySelectorAll('uds-tab').forEach(tab => {
            if (show) {
                tab.counter = value;
                tab.showCounter();
            } else {
                tab.counter = '';
                tab.hideCounter();
            }
        });

        counterInput.style.display = show ? '' : 'none';
        updateTable();
        return;
    }

    document.querySelectorAll(uds_component).forEach(component => {
        if (show) {
            component.showCounter();
            counterInput.style.display = '';
        } else {
            component.hideCounter();
            counterInput.style.display = 'none';
        }
    });

    updateTable();
}

function onShortcutsChange(forced) {
    onNoteChange(forced, shortcutsCheckbox);
}

function onNoteChange(forced, sourceCheckbox = noteCheckbox) {
    if (document.body.id !== 'page-list') return;

    const checked = sourceCheckbox?.checked ?? false;
    const shouldShow = forced === 'show' ? true : forced === 'hide' ? false : checked;

    document.querySelectorAll('uds-list-item').forEach(component => {
        if (shouldShow) {
            component.note = noteInput?.value ?? '';
            component.showNote();
        } else {
            component.hideNote();
        }
    });

    updateTable();
}

function onNoteInputChange() {
    if (document.body.id !== 'page-list') return;

    document.querySelectorAll('uds-list-item').forEach(component => {
        component.note = noteInput?.value ?? '';
    });

    updateTable();
}

function onDraggerChange(forced) {
    if (document.body.id !== 'page-list') return;

    const checked = draggerCheckbox?.checked ?? false;
    const shouldShow = forced === 'show' ? true : forced === 'hide' ? false : checked;

    document.querySelectorAll('uds-list-section').forEach(section => {
        section.toggleAttribute('sortable', shouldShow);
    });

    updateTable();
}

function onNestedChange(forced) {
    if (document.body.id !== 'page-list') return;

    const checked = nestedCheckbox?.checked ?? false;
    const shouldShow = forced === 'show' ? true : forced === 'hide' ? false : checked;

    document.querySelectorAll('uds-list-item[sublist]').forEach(item => {
        item.style.display = shouldShow ? '' : 'none';
    });

    document.querySelectorAll('uds-list[sublist]').forEach(list => {
        list.style.display = shouldShow ? '' : 'none';

        if (!shouldShow) {
            list.removeAttribute('open');
            list.style.top = '';
            list.style.left = '';
            list.style.position = '';
        }
    });

    updateTable();
}

function onSectionStyleChange(e, force = null) {
    const value = force ?? e?.target?.value ?? 'line';
    const selector = document.body.id == 'page-list' ? 'uds-list-section' : 'uds-menu-section';

    document.querySelectorAll(selector).forEach(section => {
        switch (value) {
            case 'line':
                section.showDivider();
                section.hideLabel();
                break;

            case 'label':
                section.hideDivider();
                section.showLabel();
                break;

            case 'both':
                section.showDivider();
                section.showLabel();
                break;
        }
    });

    updateTable();
}

function onExclusiveChange() {
    if (document.body.id !== 'page-list') return;

    const exclusive = exclusiveCheckbox.checked;

    document.querySelectorAll('uds-list').forEach(list => {
        list.toggleAttribute('multiple', !exclusive);

        if (exclusive) {
            const items = [...list.querySelectorAll('uds-list-item')].filter(item =>
                item.closest('uds-list') === list
            );

            const selectedItems = items.filter(item => item.selected);
            const selectedItem = selectedItems[0] || null;

            if (selectedItems.length > 1) {
                items.forEach(item => {
                    item.selected = item === selectedItem;
                });
            }
        }
    });

    updateTable();
}

function onCheckmarkChange(forced) {
    const checked = checkmarkCheckbox.checked;
    const shouldShow = forced === 'show' ? true : forced === 'hide' ? false : checked;

    document.querySelectorAll('uds-list-section').forEach(section => {
        if (shouldShow) {
            section.removeAttribute('checkmark');
        } else {
            section.setAttribute('checkmark', 'none');
        }
    });

    onLeftIconsChange(leftIconsCheckbox?.checked ? 'show' : 'hide');
    updateTable();
}

function onSectionLineChange() {
    const show = sectionLineCheckbox.checked;

    document.querySelectorAll('uds-menu-section').forEach(section => {
        if (show) {
            section.showDivider();
        } else {
            section.hideDivider();
        }
    });

    updateTable();
}

function onInputTypeChange() {
    const value = inputTypeSelect.value;

    document.querySelectorAll(uds_component).forEach(component => {
        component.inputType = value;
    });

    updateTable();
}

function onButtonsNumberChange() {
    const count = parseInt(document.getElementById('component-buttons-number').value, 10);
    if (!count || count < 1) return;

    document.querySelectorAll('uds-segment').forEach(segment => {
        const buttons = Array.from(segment.querySelectorAll('uds-button'));

        if (buttons.length > count) {
            buttons.slice(count).forEach(btn => btn.remove());
        }

        if (buttons.length < count) {
            for (let i = buttons.length; i < count; i++) {
                const btn = document.createElement('uds-button');
                btn.setAttribute('value', `item-${i + 1}`);
                btn.label = `Item ${i + 1}`;
                segment.appendChild(btn);
            }
        }

        const updated = segment.querySelectorAll('uds-button');
        updated.forEach((btn, i) => {
            btn.toggleAttribute('segment-first', i === 0);
            btn.toggleAttribute('segment-last', i === updated.length - 1);
        });
    });

    updateTable();
}

function onTabsNumberChange() {
    if (document.body.id !== 'page-tabs') return;

    const count = parseInt(tabsNumber.value, 10);
    if (!count || count < 1) return;

    const labels = (labelInput?.value || '')
        .split(',')
        .map(value => value.trim())
        .filter(Boolean);

    document.querySelectorAll('uds-tabs').forEach(tabs => {
        const tabItems = Array.from(tabs.querySelectorAll('uds-tab'));

        if (tabItems.length > count) {
            tabItems.slice(count).forEach(tab => tab.remove());
        }

        if (tabItems.length < count) {
            const templateTab = tabItems[0] || null;

            for (let i = tabItems.length; i < count; i++) {
                const tab = templateTab
                    ? templateTab.cloneNode(true)
                    : document.createElement('uds-tab');

                tab.removeAttribute('active');
                tab.removeAttribute('delimiters');
                tab.removeAttribute('fill');

                tab.setAttribute('value', `tab${i + 1}`);
                tab.label = labels[i] || `Item ${i + 1}`;

                tabs.appendChild(tab);
            }
        }

        const updatedTabs = Array.from(tabs.querySelectorAll('uds-tab'));
        const currentValue = tabs.getAttribute('value');
        const hasCurrentValue = updatedTabs.some(tab => tab.getAttribute('value') === currentValue);

        if (!hasCurrentValue && updatedTabs[0]) {
            tabs.value = updatedTabs[0].getAttribute('value') || 'tab1';
        }
    });

    onLabelInputChange();
    onLabelChange();
    onLeftIconChange();
    onRightIconChange();
    onTopIconChange();
    onCounterChange();
    onRightButtonChange();

    lucide.createIcons();
    updateTable();
}

function onInputWidthChange() {
    const value = inputWidth.value.trim();

    if (document.body.id === 'page-tabs') {
        const cells = document.querySelectorAll('#page-tabs .period[data-period="fill"] .group > .cell');

        if (!value) {
            cells.forEach(cell => {
                cell.style.width = '';
                cell.style.minWidth = '';
            });

            return;
        }

        const width = /^\d+$/.test(value) ? `${value}px` : value;

        cells.forEach(cell => {
            cell.style.width = width;
            cell.style.minWidth = width;
        });

        return;
    }

    if (!value) return;

    const width = /^\d+$/.test(value) ? `${value}px` : value;

    document.querySelectorAll('uds-segment').forEach(segment => {
        segment.style.width = width;
    });
}

function onDescriptionChange() {
    const show = descriptionCheckbox.checked;
    const value = descriptionInput.value;

    if (document.body.id == 'page-menu' || document.body.id == 'page-list') {
        const selector = document.body.id == 'page-menu' ? 'uds-menu-item' : 'uds-list-item';

        document.querySelectorAll(selector).forEach(component => {
            if (show) {
                component.description = value;
                component.showDescription();
                descriptionInput.style.display = '';
            } else {
                component.hideDescription();
                descriptionInput.style.display = 'none';
            }
        });

        updateTable();
        return;
    }

    if (document.body.id === 'page-toggle') {
        document.querySelectorAll('uds-toggle').forEach(component => {
            if (show) {
                component.description = value;
                component.showDescription();
                descriptionInput.style.display = '';
            } else {
                component.hideDescription();
                descriptionInput.style.display = 'none';
            }
        });

        updateTable();
        return;
    }

    document.querySelectorAll(uds_component).forEach(component => {
        if (!('description' in component)) return;

        if (show) {
            component.description = value;
            component.showDescription?.();
            descriptionInput.style.display = '';
        } else {
            component.hideDescription?.();
            descriptionInput.style.display = 'none';
        }
    });

    updateTable();
}

function onCounterInputChange() {
    const value = counterInput.value;

    if (document.body.id === 'page-segment') {
        document.querySelectorAll('uds-segment').forEach(segment => {
            segment.querySelectorAll('uds-button').forEach(button => {
                button.counter = value;
            });
        });

        updateTable();
        return;
    }

    if (document.body.id === 'page-split-button') {
        document.querySelectorAll('uds-split-button').forEach(splitButton => {
            const button = splitButton.querySelector('uds-button');
            if (!button) return;

            button.counter = value;
        });

        updateTable();
        return;
    }

    if (document.body.id === 'page-tabs') {
        document.querySelectorAll('uds-tab').forEach(tab => {
            tab.counter = value;
        });

        updateTable();
        return;
    }

    document.querySelectorAll(uds_component).forEach(component => {
        component.counter = value;
    });

    updateTable();
}

function onPlaceholderInputChange() {
    const value = placeholderInput.value;

    document.querySelectorAll(uds_component).forEach(component => {
        component.placeholder = value;
    });

    updateTable();
}

function onDescriptionInputChange() {
    const value = descriptionInput.value;

    if (document.body.id == 'page-menu' || document.body.id == 'page-list') {
        const selector = document.body.id == 'page-menu' ? 'uds-menu-item' : 'uds-list-item';

        document.querySelectorAll(selector).forEach(component => {
            component.description = value;
        });

        updateTable();
        return;
    }

    if (document.body.id === 'page-toggle') {
        document.querySelectorAll('uds-toggle').forEach(component => {
            component.description = value;
        });

        updateTable();
        return;
    }

    document.querySelectorAll(uds_component).forEach(component => {
        if ('description' in component) {
            component.description = value;
        }
    });

    updateTable();
}

function onIndeterminateChange() {
    const indeterminate = indeterminateCheckbox.checked;

    document.querySelectorAll(uds_component).forEach(component => {
        component.indeterminate = indeterminate;
    });
}

function onDisabledChange() {
    const disabled = disabledCheckbox.checked;

    if (document.body.id === 'page-segment') {
        document.querySelectorAll('uds-segment').forEach(segment => {
            segment.querySelectorAll('uds-button').forEach(button => {
                button.disabled = disabled;
            });
        });
        return;
    }

    if (document.body.id === 'page-tabs') {
        document.querySelectorAll('uds-tab').forEach(tab => {
            tab.disabled = disabled;
        });
        return;
    }

    document.querySelectorAll(uds_component).forEach(component => {
        component.disabled = disabled;
    });
}

function onDisabledLeftChange() {
    const disabled = disabledLeftCheckbox.checked;

    document.querySelectorAll('uds-split-button').forEach(splitButton => {
        const button = splitButton.querySelector('uds-button');

        if (button) button.disabled = disabled;
    });
}

function onDisabledRightChange() {
    const disabled = disabledRightCheckbox.checked;

    document.querySelectorAll('uds-split-button').forEach(splitButton => {
        const toggleButton = splitButton.querySelector('uds-toggle-button');

        if (toggleButton) toggleButton.disabled = disabled;
    });
}

function onReadonlyChange() {
    const readonly = readonlyCheckbox.checked;

    document.querySelectorAll(uds_component).forEach(component => {
        component.readonly = readonly;
    });
}

function onLoadingChange() {
    const loading = loadingCheckbox.checked;

    if (document.body.id === 'page-split-button') {
        document.querySelectorAll('uds-split-button').forEach(splitButton => {
            const button = splitButton.querySelector('uds-button');

            if (button) button.loading = loading;
        });
        return;
    }

    document.querySelectorAll(uds_component).forEach(component => {
        component.loading = loading;
    });
}

function onRoundChange() {
    const round = roundCheckbox.checked;

    if (document.body.id != 'page-menu' && document.body.id != 'page-list') {
        document.querySelectorAll(uds_component).forEach(component => {
            component.round = round;
        });
    } else {
        var selector = (document.body.id == 'page-menu') ? 'uds-menu-item' : 'uds-list-item';
        
        document.querySelectorAll(selector).forEach(component => {
            component.round = round;
        });
    }
}

function onScaleChange() {
    const scale = scaleCheckbox.checked;

    if (document.body.id === 'page-split-button') {
        document.querySelectorAll('uds-split-button').forEach(splitButton => {
            const button = splitButton.querySelector('uds-button');
            const toggleButton = splitButton.querySelector('uds-toggle-button');

            if (button) button.scale = scale;
            if (toggleButton) toggleButton.scale = scale;
        });
        return;
    }

    if (document.body.id != 'page-menu' && document.body.id != 'page-list') {
        document.querySelectorAll(uds_component).forEach(component => {
            component.scale = scale;
        });
    } else {
        var selector = (document.body.id == 'page-menu') ? 'uds-menu-item' : 'uds-list-item';

        document.querySelectorAll(selector).forEach(component => {
            component.scale = scale;
        });
    }
}

async function afterAllComponentsReady() {
    await customElements.whenDefined(uds_component);
    const components = [...document.querySelectorAll(uds_component)];
    await Promise.all(components.map(component => component.ready));

    if (document.body.id == 'page-menu') {
        setTimeout(() => {
            onShortcutsChange('hide');
            onRightIconsChange('hide');
            onSectionStyleChange(null, 'line');

            document.body.classList.add('demo-ready');
        }, 500);
    }

    if (document.body.id == 'page-list') {
        setTimeout(() => {
            onLeftIconsChange('hide');
            onListItemButtonChange('button-1', false);
            onListItemButtonChange('button-2', false);
            onNoteInputChange();
            onNoteChange('hide');
            onExclusiveChange();
            onModeChange();
            onNestedChange(nestedCheckbox?.checked ? 'show' : 'hide');
            onSectionStyleChange(null, sectionStyle?.value || 'line');

            document.body.classList.add('demo-ready');
        }, 500);
    }

    if (document.body.id == 'page-tabs') {
        setTimeout(() => {
            onLevelChange();
            onTabsNumberChange();
            onLabelInputChange();
            onLabelChange();
            onLeftIconChange();
            onRightIconChange();
            onTopIconChange();
            onCounterChange();
            onRightButtonChange();
            onInputWidthChange();
            onDisabledChange();

            document.body.classList.add('demo-ready');
        }, 500);
    }

    if (document.body.id == 'page-toggle') {
        setTimeout(() => {
            onDescriptionChange();

            document.body.classList.add('demo-ready');
        }, 500);
    }

    updateTable();
}

afterAllComponentsReady();