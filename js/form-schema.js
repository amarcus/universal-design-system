const uds_component = 'uds-form';

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
        title: 'Form elements',
        fields: [
            {
                id: 'component-fields',
                type: 'checkbox-group',
                label: 'Field types',
                options: [
                    { value: 'input', label: 'Input box', checked: true },
                    { value: 'checkbox-group', label: 'Checkbox group', checked: true },
                    { value: 'radio-group', label: 'Radio group', checked: true },
                    { value: 'segmented-button', label: 'Segmented button', checked: true },
                    { value: 'segmented-button', label: 'Segmented input', checked: true },
                    { value: 'toggle', label: 'Toggle (switcher)', checked: true },
                    { value: 'toggle-button', label: 'Toggle button - Color picker', checked: true },
                    { value: 'dropdown-list', label: 'Toggle button - Dropdown list', checked: true },
                ]
            }
        ]
    },
    {
        title: 'Other',
        fields: [
            {
                id: 'component-tabs-type',
                type: 'radio-group',
                label: 'Tabs',
                options: [
                    { value: 'none', label: 'None', checked: true },
                    { value: 'horizontal', label: 'Horizontal - Simple' },
                    { value: 'horizontal-icon', label: 'Horizontal - With icons' },
                    { value: 'vertical', label: 'Vertical' },
                ],
            },
            {
                id: 'component-field-elements',
                type: 'checkbox-group',
                label: 'Field elements',
                options: [
                    { value: 'info-icons', label: 'Info icons' },
                    { value: 'field-descriptions', label: 'Field descriptions' },
                ],
            }
        ]
    },
];