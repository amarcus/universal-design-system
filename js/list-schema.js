const uds_component = 'uds-list';

const icons = Object.keys(lucide).map(name => {
    const value = name
        .replace(/Icon$/, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();

    return {
        value,
        label: value
    };
});

const uds_schema = [
    {
        title: 'Theme',
        fields: [
            {
                id: 'theme',
                type: 'radio-group',
                options: [
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'auto', label: 'Auto', checked: true }
                ]
            }
        ]
    },
    {
        title: 'Matrix elements',
        fields: [
            {
                id: 'component-style',
                type: 'checkbox-group',
                label: 'Style (variant)',
                options: [
                    { value: 'filled', label: 'Filled', checked: true },
                    { value: 'outline', label: 'Outline', checked: true },
                    { value: 'ghost', label: 'Ghost', checked: true },
                    { value: 'text', label: 'Text', checked: true }
                ]
            },
            {
                id: 'component-type',
                type: 'checkbox-group',
                label: 'Type',
                options: [
                    { value: 'primary', label: 'Primary', checked: true },
                    { value: 'secondary', label: 'Secondary', checked: true },
                ]
            },
        ]
    },
    {
        title: 'Component parts',
        fields: [
            {
                id: 'component-checkmark',
                type: 'checkbox',
                label: 'Checkmark',
                checked: true
            },
            {
                id: 'component-left-icons',
                type: 'checkbox',
                label: 'Left icon',
                checked: false
            },
            {
                id: 'component-button-1',
                type: 'checkbox',
                label: 'Button 1',
                checked: false
            },
            {
                id: 'component-button-2',
                type: 'checkbox',
                label: 'Button 2',
                checked: false
            },
            {
                id: 'component-note',
                type: 'checkbox',
                label: 'Note',
                checked: false
            },
            {
                id: 'component-note-value',
                type: 'text',
                value: '1',
                visibleIf: 'component-note'
            },
            {
                id: 'component-dragger',
                type: 'checkbox',
                label: 'Dragger',
                checked: false
            },
            {
                id: 'component-description',
                type: 'checkbox',
                label: 'Description',
                checked: false
            },
            {
                id: 'component-description-value',
                type: 'text',
                value: 'Description',
                visibleIf: 'component-description'
            },
            {
                id: 'component-section-style',
                type: 'select',
                options: [
                    { value: 'line', label: 'Line only', checked: true },
                    { value: 'label', label: 'Label only' },
                    { value: 'both', label: 'Line and label' },
                ],
                value: 'line',
                label: 'Section titles'
            },
        ]
    },
    {
        title: 'Component options',
        fields: [
            {
                id: 'component-mode',
                type: 'select',
                options: [
                    { value: 'dropdown', label: 'Dropdown', checked: true },
                    { value: 'listbox', label: 'Listbox' },
                    { value: 'listbox-classic', label: 'Listbox classic' },
                ],
                value: 'dropdown',
                label: 'List mode'
            },
            {
                id: 'component-exclusive',
                type: 'checkbox',
                label: 'Mutually exclusive',
                checked: true,
            },
            {
                id: 'component-nested',
                type: 'checkbox',
                label: 'Nested',
                visibleIf: 'component-mode',
                visibleIfValue: 'dropdown'
            },
            {
                id: 'component-round',
                type: 'checkbox',
                label: 'Round'
            },
            {
                id: 'component-scale',
                type: 'checkbox',
                label: 'Scale on click'
            },
        ]
    },
];