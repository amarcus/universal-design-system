const uds_component = 'uds-menu';

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
        ]
    },
    {
        title: 'Component parts',
        fields: [
            {
                id: 'component-left-icons',
                type: 'checkbox',
                label: 'Left icons',
                checked: true
            },
            {
                id: 'component-right-icons',
                type: 'checkbox',
                label: 'Right icons',
                checked: false
            },
            {
                id: 'component-shortcuts',
                type: 'checkbox',
                label: 'Shortcuts',
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
                id: 'component-round',
                type: 'checkbox',
                label: 'Round'
            },
            {
                id: 'component-scale',
                type: 'checkbox',
                label: 'Scale on click'
            }
        ]
    },
];