const uds_component = 'uds-segment';

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
                value: 'Day, Week, Month',
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
                id: 'component-right-icon',
                type: 'checkbox',
                label: 'Right icon',
                checked: false
            },
            {
                id: 'righticon',
                type: 'select',
                options: icons,
                value: 'chevron-down',
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
            }
        ]
    },
    {
        title: 'Component options',
        fields: [
            {
                id: 'component-buttons-number',
                type: 'select',
                options: [
                    {value: '2', label: '2'},
                    {value: '3', label: '3'},
                    {value: '4', label: '4'},
                    {value: '5', label: '5'},
                    {value: '6', label: '6'},
                    {value: '7', label: '7'},
                    {value: '8', label: '8'},
                    {value: '9', label: '9'},
                    {value: '10', label: '10'},
                ],
                value: '3',
                label: 'Number of buttons'
            },
            {
                id: 'component-label-width',
                type: 'text',
                value: '300',
                label: 'Width, px'
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
            }
        ]
    },
];