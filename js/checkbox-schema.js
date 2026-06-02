const uds_component = 'uds-checkbox';

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
                    { value: 'danger', label: 'Danger', checked: true }
                ]
            },
            {
                id: 'component-size',
                type: 'checkbox-group',
                label: 'Size',
                options: [
                    { value: 'small', label: 'Small', checked: true },
                    { value: 'medium', label: 'Medium', checked: true },
                    { value: 'large', label: 'Large', checked: true }
                ]
            }
        ]
    },
    {
        title: 'Component parts',
        fields: [
            {
                id: 'component-label',
                type: 'checkbox',
                label: 'Label',
                checked: true
            },
            {
                id: 'component-label-value',
                type: 'text',
                value: 'Checkbox',
                visibleIf: 'component-label'
            },
            {
                id: 'component-right-icon',
                type: 'checkbox',
                label: 'Right icon',
                checked: true
            },
            {
                id: 'righticon',
                type: 'select',
                options: icons,
                value: 'info',
                visibleIf: 'component-right-icon'
            },
            {
                id: 'component-counter',
                type: 'checkbox',
                label: 'Counter',
                checked: true
            },
            {
                id: 'component-counter-value',
                type: 'text',
                value: '3',
                visibleIf: 'component-counter'
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
        ]
    },
    {
        title: 'Component options',
        fields: [
            {
                id: 'component-indeterminate',
                type: 'checkbox',
                label: 'Indeterminate'
            },
            {
                id: 'component-disabled',
                type: 'checkbox',
                label: 'Disabled'
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
            }
        ]
    },
];