const uds_component = 'uds-toggle';

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
                value: 'Label',
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
                id: 'component-disabled',
                type: 'checkbox',
                label: 'Disabled'
            },
            {
                id: 'component-scale',
                type: 'checkbox',
                label: 'Scale on click'
            }
        ]
    },
];