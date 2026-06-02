# Form

The `uds-form` component is used for building structured forms, settings panels, dialogs, property editors, and configuration windows.

It supports form groups, field labels, field descriptions, label icons, input fields, checkbox groups, radio groups, segmented controls, toggles, dropdown lists, color picker controls, tabs, and action buttons.

## Import

```html
<script type="module" src="dist/components/form/uds-form.js"></script>
```

For a complete form demo, you may also need the components used inside the form:

```html
<script type="module" src="dist/components/button/uds-button.js"></script>
<script type="module" src="dist/components/toggle-button/uds-toggle-button.js"></script>
<script type="module" src="dist/components/checkbox/uds-checkbox.js"></script>
<script type="module" src="dist/components/checkbox/uds-checkbox-group.js"></script>
<script type="module" src="dist/components/radio/uds-radio.js"></script>
<script type="module" src="dist/components/radio/uds-radio-group.js"></script>
<script type="module" src="dist/components/input/uds-input.js"></script>
<script type="module" src="dist/components/segment/uds-segment.js"></script>
<script type="module" src="dist/components/toggle/uds-toggle.js"></script>
<script type="module" src="dist/components/list/uds-list-item.js"></script>
<script type="module" src="dist/components/list/uds-list-section.js"></script>
<script type="module" src="dist/components/list/uds-list.js"></script>
<script type="module" src="dist/components/tabs/uds-tabs.js"></script>
```

## Basic usage

```html
<uds-form>
    <uds-form-group>
        <h2 slot="title">Group title</h2>
        <p slot="description">Group description</p>

        <uds-field>
            <label slot="label">Input field</label>
            <uds-input placeholder="Placeholder"></uds-input>
        </uds-field>
    </uds-form-group>
</uds-form>
```

## Form group

Use `uds-form-group` to group related fields. A group can include a title and description.

```html
<uds-form>
    <uds-form-group>
        <h2 slot="title">Group title</h2>
        <p slot="description">Group description</p>

        <uds-field>
            <label slot="label">Input field</label>
            <uds-input placeholder="Placeholder"></uds-input>
        </uds-field>
    </uds-form-group>
</uds-form>
```

## Field

Use `uds-field` to wrap a label, optional label icon, optional description, and a form control.

```html
<uds-field>
    <label slot="label">Input field</label>
    <i slot="label-icon" data-lucide="info"></i>
    <uds-input placeholder="Placeholder"></uds-input>
</uds-field>
```

## Input field

Use `uds-input` inside `uds-field` for text input.

```html
<uds-field>
    <label slot="label">Input field</label>
    <i slot="label-icon" data-lucide="info"></i>
    <uds-input placeholder="Placeholder"></uds-input>
</uds-field>
```

## Checkbox group

Use `uds-checkbox-group` when users can select multiple options.

```html
<uds-field>
    <label slot="label">Checkbox group</label>
    <i slot="label-icon" data-lucide="info"></i>

    <uds-checkbox-group>
        <uds-checkbox type="secondary" variant="text">Checkbox</uds-checkbox>
        <uds-checkbox type="secondary" variant="text">Checkbox</uds-checkbox>
        <uds-checkbox type="secondary" variant="text">Checkbox</uds-checkbox>
    </uds-checkbox-group>
</uds-field>
```

## Radio group

Use `uds-radio-group` when users must select exactly one option from a set.

```html
<uds-field>
    <label slot="label">Radio group</label>
    <i slot="label-icon" data-lucide="info"></i>

    <uds-radio-group>
        <uds-radio type="secondary" variant="text" checked>Option</uds-radio>
        <uds-radio type="secondary" variant="text">Option</uds-radio>
        <uds-radio type="secondary" variant="text">Option</uds-radio>
    </uds-radio-group>
</uds-field>
```

## Dropdown list

Use `uds-toggle-button` with a slotted `uds-list` to create a dropdown field.

```html
<uds-field>
    <label slot="label">Dropdown list</label>
    <i slot="label-icon" data-lucide="info"></i>

    <uds-toggle-button type="secondary" size="medium" variant="filled">
        Not selected
        <i slot="icon-right" data-lucide="chevrons-up-down"></i>

        <uds-list slot="dropdown" variant="filled" value="1">
            <uds-list-section>
                <uds-list-item value="1" selected>Option 1</uds-list-item>
                <uds-list-item value="2">Option 2</uds-list-item>
                <uds-list-item value="3">Option 3</uds-list-item>
            </uds-list-section>
        </uds-list>
    </uds-toggle-button>
</uds-field>
```

## Segmented control field

Use `uds-segment` when users need to choose one option from a compact group.

```html
<uds-field>
    <label slot="label">Segmented button</label>
    <i slot="label-icon" data-lucide="info"></i>

    <uds-segment type="secondary" size="medium" variant="filled" value="day">
        <uds-button value="day">Day</uds-button>
        <uds-button value="week">Week</uds-button>
        <uds-button value="month">Month</uds-button>
    </uds-segment>
</uds-field>
```

## Toggle field

Use `uds-toggle` for persistent on/off settings.

```html
<uds-field>
    <label slot="label">Toggle</label>
    <i slot="label-icon" data-lucide="info"></i>
    <uds-toggle></uds-toggle>
</uds-field>
```

## Color picker field

A color picker can be built from a `uds-toggle-button` and a hidden color input.

```html
<uds-field>
    <label slot="label">Color select</label>
    <i slot="label-icon" data-lucide="info"></i>

    <div class="color-select">
        <uds-toggle-button type="secondary" size="medium" variant="filled" id="color-select-button">
            Action
            <i slot="icon-right" data-lucide="chevron-down"></i>
        </uds-toggle-button>

        <input id="color-select-input" class="color-select-input" data-coloris value="#4f46e5">
    </div>
</uds-field>
```

## Form with tabs

Use tabs above the form when the same dialog or panel contains multiple related form sections.

```html
<uds-tabs level="section" value="tab1">
    <uds-tab value="tab1">First tab</uds-tab>
    <uds-tab value="tab2">Second tab</uds-tab>
    <uds-tab value="tab3">Third tab</uds-tab>
</uds-tabs>

<uds-form>
    <uds-form-group>
        <h2 slot="title">Group title</h2>
        <p slot="description">Group description</p>

        <uds-field>
            <label slot="label">Input field</label>
            <uds-input placeholder="Placeholder"></uds-input>
        </uds-field>
    </uds-form-group>
</uds-form>
```

## Form inside a dialog window

A form can be placed inside a dialog-like window with a header and footer actions.

```html
<div class="window">
    <div class="window-header">
        <h1>Window title</h1>
        <uds-button class="window-close" type="secondary" size="small">
            <i slot="icon" data-lucide="x"></i>
        </uds-button>
    </div>

    <div class="window-body">
        <uds-form>
            <uds-form-group>
                <h2 slot="title">Group title</h2>
                <p slot="description">Group description</p>

                <uds-field>
                    <label slot="label">Input field</label>
                    <uds-input placeholder="Placeholder"></uds-input>
                </uds-field>
            </uds-form-group>
        </uds-form>
    </div>

    <div class="window-bottom">
        <uds-button type="secondary">Cancel</uds-button>
        <uds-button>Save</uds-button>
    </div>
</div>
```

## Form components

| Component | Description |
|---|---|
| `uds-form` | Main form container |
| `uds-form-group` | Group of related fields |
| `uds-field` | Field wrapper for label, icon, description, and control |
| `uds-input` | Text input |
| `uds-checkbox-group` | Multiple-choice checkbox group |
| `uds-radio-group` | Single-choice radio group |
| `uds-segment` | Compact single-choice segmented control |
| `uds-toggle` | On/off setting |
| `uds-toggle-button` | Button-like toggle or dropdown trigger |
| `uds-list` | Dropdown list content |
| `uds-tabs` | Optional form section switcher |

## Form group slots

| Slot | Description |
|---|---|
| `title` | Group title |
| `description` | Group description |

## Field slots

| Slot | Description |
|---|---|
| `label` | Field label |
| `label-icon` | Optional icon near the label |
| default | Field control |

## Recommended usage

Use forms for structured data entry, settings, filters, and configuration panels.

Group related fields with `uds-form-group`. Use group titles and descriptions when the form has multiple sections or needs explanation.

Use `uds-field` for each field so labels, icons, descriptions, and controls stay aligned consistently.

Use input fields for free text, checkbox groups for independent multiple choices, radio groups for mutually exclusive choices, segmented controls for compact single-choice options, and toggles for persistent on/off settings.

Use tabs only when the form would otherwise become too long or when the fields belong to clearly different sections.

Keep labels short and direct. Use descriptions for clarification, not as a replacement for clear labels.

Avoid placing too many different control types in one small form unless the complexity is necessary.

Use primary and secondary footer actions consistently. Usually, the primary action should be on the right and the secondary action on the left.

## Complete example

```html
<div class="window">
    <div class="window-header">
        <h1>Window title</h1>
        <uds-button class="window-close" type="secondary" size="small">
            <i slot="icon" data-lucide="x"></i>
        </uds-button>
    </div>

    <div class="window-body">
        <uds-tabs level="section" value="tab1">
            <uds-tab value="tab1">First tab</uds-tab>
            <uds-tab value="tab2">Second tab</uds-tab>
            <uds-tab value="tab3">Third tab</uds-tab>
        </uds-tabs>

        <uds-form>
            <uds-form-group>
                <h2 slot="title">Group title</h2>
                <p slot="description">Group description</p>

                <uds-field>
                    <label slot="label">Input field</label>
                    <i slot="label-icon" data-lucide="info"></i>
                    <uds-input placeholder="Placeholder"></uds-input>
                </uds-field>

                <uds-field>
                    <label slot="label">Checkbox group</label>
                    <i slot="label-icon" data-lucide="info"></i>

                    <uds-checkbox-group>
                        <uds-checkbox type="secondary" variant="text">Checkbox</uds-checkbox>
                        <uds-checkbox type="secondary" variant="text">Checkbox</uds-checkbox>
                        <uds-checkbox type="secondary" variant="text">Checkbox</uds-checkbox>
                    </uds-checkbox-group>
                </uds-field>

                <uds-field>
                    <label slot="label">Radio group</label>
                    <i slot="label-icon" data-lucide="info"></i>

                    <uds-radio-group>
                        <uds-radio type="secondary" variant="text" checked>Option</uds-radio>
                        <uds-radio type="secondary" variant="text">Option</uds-radio>
                        <uds-radio type="secondary" variant="text">Option</uds-radio>
                    </uds-radio-group>
                </uds-field>

                <uds-field>
                    <label slot="label">Segmented button</label>
                    <i slot="label-icon" data-lucide="info"></i>

                    <uds-segment type="secondary" size="medium" variant="filled" value="day">
                        <uds-button value="day">Day</uds-button>
                        <uds-button value="week">Week</uds-button>
                        <uds-button value="month">Month</uds-button>
                    </uds-segment>
                </uds-field>

                <uds-field>
                    <label slot="label">Toggle</label>
                    <i slot="label-icon" data-lucide="info"></i>
                    <uds-toggle></uds-toggle>
                </uds-field>
            </uds-form-group>
        </uds-form>
    </div>

    <div class="window-bottom">
        <uds-button type="secondary">Cancel</uds-button>
        <uds-button>Save</uds-button>
    </div>
</div>
```