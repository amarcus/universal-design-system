# Checkbox

The `uds-checkbox` component is used for selecting one or more options in forms, filters, settings panels, and preference lists.

It supports multiple visual variants, semantic types, sizes, right-side icons, counters, descriptions, disabled state, indeterminate state, rounded shape, and optional scale-on-click behavior.

## Import

```html
<script type="module" src="dist/components/checkbox/uds-checkbox.js"></script>
<script type="module" src="dist/components/checkbox/uds-checkbox-group.js"></script>
```

## Basic usage

```html
<uds-checkbox type="primary" size="medium" variant="filled">
    Checkbox
</uds-checkbox>
```

## With right icon

Use the `icon-right` slot to place an icon after the label.

```html
<uds-checkbox type="primary" size="medium" variant="filled">
    Checkbox
    <i slot="icon-right" data-lucide="info"></i>
</uds-checkbox>
```

## With counter

Use the `counter` attribute to display a small numeric badge inside the checkbox component.

```html
<uds-checkbox type="primary" size="medium" variant="filled" counter="3">
    Checkbox
</uds-checkbox>
```

## With description

Use the `description` attribute to add supporting text.

```html
<uds-checkbox type="primary" size="medium" variant="filled" description="Description">
    Checkbox
</uds-checkbox>
```

## Types

The `type` attribute defines the semantic role and color treatment of the checkbox.

| Type | Description |
|---|---|
| `primary` | Main or default checkbox style |
| `secondary` | Lower-emphasis checkbox style |
| `danger` | Checkbox for destructive, risky, or warning-related options |

Example:

```html
<uds-checkbox type="danger" size="medium" variant="filled">
    Delete related files
</uds-checkbox>
```

## Variants

The `variant` attribute defines the visual style of the checkbox container.

| Variant | Description |
|---|---|
| `filled` | High-emphasis checkbox with solid visual treatment |
| `outline` | Medium-emphasis checkbox with border treatment |
| `ghost` | Low-emphasis checkbox with transparent background |
| `text` | Minimal text-style checkbox |

Example:

```html
<uds-checkbox type="primary" size="medium" variant="outline">
    Checkbox
</uds-checkbox>
```

## Sizes

The `size` attribute controls checkbox size, spacing, icon size, and typography.

| Size | Description |
|---|---|
| `small` | Compact checkbox for dense interfaces |
| `medium` | Default checkbox size |
| `large` | Larger checkbox for high-visibility settings or touch-friendly layouts |

Example:

```html
<uds-checkbox type="primary" size="large" variant="filled">
    Checkbox
</uds-checkbox>
```

## States and options

### Disabled

Use the `disabled` attribute when the option is unavailable.

```html
<uds-checkbox type="primary" size="medium" variant="filled" disabled>
    Checkbox
</uds-checkbox>
```

### Indeterminate

Use the `indeterminate` attribute when the checkbox represents a mixed state, such as a partially selected group.

```html
<uds-checkbox type="primary" size="medium" variant="filled" indeterminate>
    Select all
</uds-checkbox>
```

### Round

Use the `round` attribute for a more rounded visual treatment.

```html
<uds-checkbox type="primary" size="medium" variant="filled" round>
    Checkbox
</uds-checkbox>
```

### Scale on click

Use the `scale` attribute to add a subtle pressed animation.

```html
<uds-checkbox type="primary" size="medium" variant="filled" scale>
    Checkbox
</uds-checkbox>
```

## Attributes

| Attribute | Values | Description |
|---|---|---|
| `type` | `primary`, `secondary`, `danger` | Semantic type and color treatment |
| `variant` | `filled`, `outline`, `ghost`, `text` | Visual style |
| `size` | `small`, `medium`, `large` | Checkbox size |
| `counter` | number/string | Optional counter badge |
| `description` | string | Optional supporting text |
| `disabled` | boolean | Disables the checkbox |
| `indeterminate` | boolean | Shows a mixed or partially selected state |
| `round` | boolean | Makes the component more rounded |
| `scale` | boolean | Adds scale-on-click interaction |

## Slots

| Slot | Description |
|---|---|
| default | Checkbox label |
| `icon-right` | Right icon |

## Recommended usage

Use checkboxes when users can select one or more options independently.

Use an indeterminate checkbox for parent items when only some child items are selected.

Use `danger` only for risky or destructive options, such as deleting related data, resetting settings, or applying irreversible changes.

Use counters when the option represents a group, category, or number of related items.

Avoid using a checkbox as a replacement for a button. A checkbox should represent a state or preference, not trigger a one-time action.

## Examples

### Primary filled checkbox

```html
<uds-checkbox type="primary" size="medium" variant="filled">
    Enable notifications
</uds-checkbox>
```

### Secondary outline checkbox

```html
<uds-checkbox type="secondary" size="medium" variant="outline">
    Show advanced options
</uds-checkbox>
```

### Danger checkbox

```html
<uds-checkbox type="danger" size="medium" variant="filled">
    Delete related files
</uds-checkbox>
```

### Checkbox with right icon and counter

```html
<uds-checkbox type="primary" size="medium" variant="filled" counter="3">
    Checkbox
    <i slot="icon-right" data-lucide="info"></i>
</uds-checkbox>
```

### Indeterminate checkbox

```html
<uds-checkbox type="primary" size="medium" variant="filled" indeterminate>
    Select all
</uds-checkbox>
```