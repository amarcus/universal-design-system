# Radio button

The `uds-radio` component is used for selecting a single option from a set of mutually exclusive choices.

It supports multiple visual variants, semantic types, sizes, right-side icons, counters, descriptions, disabled state, rounded shape, and optional scale-on-click behavior.

## Import

```html
<script type="module" src="dist/components/radio/uds-radio.js"></script>
<script type="module" src="dist/components/radio/uds-radio-group.js"></script>
```

## Basic usage

```html
<uds-radio type="primary" size="medium" variant="filled">
    Option
</uds-radio>
```

## With right icon

Use the `icon-right` slot to place an icon after the label.

```html
<uds-radio type="primary" size="medium" variant="filled">
    Option
    <i slot="icon-right" data-lucide="info"></i>
</uds-radio>
```

## With counter

Use the `counter` attribute to display a small numeric badge inside the radio component.

```html
<uds-radio type="primary" size="medium" variant="filled" counter="3">
    Option
</uds-radio>
```

## With description

Use the `description` attribute to add supporting text to the radio option.

```html
<uds-radio type="primary" size="medium" variant="filled" description="Description">
    Option
</uds-radio>
```

## Types

The `type` attribute defines the semantic role and color treatment of the radio button.

| Type | Description |
|---|---|
| `primary` | Main or default radio style |
| `secondary` | Lower-emphasis radio style |
| `danger` | Radio option for risky, destructive, or warning-related choices |

Example:

```html
<uds-radio type="danger" size="medium" variant="filled">
    Delete permanently
</uds-radio>
```

## Variants

The `variant` attribute defines the visual style of the radio option container.

| Variant | Description |
|---|---|
| `filled` | High-emphasis radio option with solid visual treatment |
| `outline` | Medium-emphasis radio option with border treatment |
| `ghost` | Low-emphasis radio option with transparent background |
| `text` | Minimal text-style radio option |

Example:

```html
<uds-radio type="primary" size="medium" variant="outline">
    Option
</uds-radio>
```

## Sizes

The `size` attribute controls radio size, spacing, icon size, and typography.

| Size | Description |
|---|---|
| `small` | Compact radio option for dense interfaces |
| `medium` | Default radio option size |
| `large` | Larger radio option for high-visibility settings or touch-friendly layouts |

Example:

```html
<uds-radio type="primary" size="large" variant="filled">
    Option
</uds-radio>
```

## States and options

### Disabled

Use the `disabled` attribute when the option is unavailable.

```html
<uds-radio type="primary" size="medium" variant="filled" disabled>
    Option
</uds-radio>
```

### Round

Use the `round` attribute for a more rounded visual treatment.

```html
<uds-radio type="primary" size="medium" variant="filled" round>
    Option
</uds-radio>
```

### Scale on click

Use the `scale` attribute to add a subtle pressed animation.

```html
<uds-radio type="primary" size="medium" variant="filled" scale>
    Option
</uds-radio>
```

## Attributes

| Attribute | Values | Description |
|---|---|---|
| `type` | `primary`, `secondary`, `danger` | Semantic type and color treatment |
| `variant` | `filled`, `outline`, `ghost`, `text` | Visual style |
| `size` | `small`, `medium`, `large` | Radio option size |
| `counter` | number/string | Optional counter badge |
| `description` | string | Optional supporting text |
| `disabled` | boolean | Disables the radio option |
| `round` | boolean | Makes the component more rounded |
| `scale` | boolean | Adds scale-on-click interaction |

## Slots

| Slot | Description |
|---|---|
| default | Radio option label |
| `icon-right` | Right icon |

## Recommended usage

Use radio buttons when users must choose exactly one option from a predefined set.

Use checkboxes instead when users can select more than one option.

Use `danger` only for risky or destructive choices, such as deleting data, resetting settings, or applying irreversible changes.

Use counters when the option represents a group, category, or number of related items.

Avoid using radio buttons for immediate actions. A radio button should represent a selected state, not trigger a one-time command.

Keep radio option labels short and mutually exclusive. If options need long explanations, use `description` for supporting text.

## Examples

### Primary filled radio button

```html
<uds-radio type="primary" size="medium" variant="filled">
    Option
</uds-radio>
```

### Secondary outline radio button

```html
<uds-radio type="secondary" size="medium" variant="outline">
    Option
</uds-radio>
```

### Danger radio button

```html
<uds-radio type="danger" size="medium" variant="filled">
    Delete permanently
</uds-radio>
```

### Radio button with right icon and counter

```html
<uds-radio type="primary" size="medium" variant="filled" counter="3">
    Option
    <i slot="icon-right" data-lucide="info"></i>
</uds-radio>
```

### Radio button with description

```html
<uds-radio type="primary" size="medium" variant="filled" description="Description">
    Option
</uds-radio>
```