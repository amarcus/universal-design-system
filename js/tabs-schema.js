const uds_component = 'uds-tabs';

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
                id: 'component-levels',
                type: 'checkbox-group',
                label: 'Levels',
                options: [
                    { value: 'l1', label: 'Level 1 - Browser', checked: true },
                    { value: 'l2', label: 'Level 2 - Body', checked: true },
                    { value: 'l3', label: 'Level 3 - Section', checked: true },
                    { value: 'l4', label: 'Level 4 - Panel', checked: true }
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
                value: 'Overview, Details, Settings',
                visibleIf: 'component-label'
            },
            {
                id: 'component-left-icon',
                type: 'checkbox',
                label: 'Left icon',
                checked: false
            },
            {
                id: 'lefticon',
                type: 'select',
                options: icons,
                value: 'copy',
                visibleIf: 'component-left-icon'
            },
            {
                id: 'component-top-icon',
                type: 'checkbox',
                label: 'Top icon (Level 2 only)',
                checked: true
            },
            {
                id: 'topicon',
                type: 'select',
                options: icons,
                value: 'star',
                visibleIf: 'component-top-icon'
            },
            {
                id: 'component-right-icon',
                type: 'checkbox',
                label: 'Right icon',
                checked: false
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
                checked: false
            },
            {
                id: 'component-counter-value',
                type: 'text',
                value: '3',
                visibleIf: 'component-counter'
            },
            {
                id: 'component-right-button-1',
                type: 'checkbox',
                label: 'Button (Level 1)',
                checked: true
            },
            {
                id: 'component-right-button-2',
                type: 'checkbox',
                label: 'Button (Level 2-4)',
                checked: false
            },
        ]
    },
    {
        title: 'Component options',
        fields: [
            {
                id: 'component-tabs-number',
                type: 'select',
                options: [
                    {value: '2', label: '2'},
                    {value: '3', label: '3'},
                    {value: '5', label: '5'},
                    {value: '6', label: '6'},
                    {value: '7', label: '7'},
                    {value: '8', label: '8'},
                    {value: '9', label: '9'},
                    {value: '10', label: '10'},
                ],
                value: '3',
                label: 'Number of tabs'
            },
            {
                id: 'component-label-width',
                type: 'text',
                value: '500',
                label: 'Width, px'
            },
            {
                id: 'component-disabled',
                type: 'checkbox',
                label: 'Disabled'
            }
        ]
    },
];