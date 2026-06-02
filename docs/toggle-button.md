# Toggle button

The `uds-toggle-button` component is used for actions that can be switched on or off, such as view modes, toolbar options, formatting controls, filters, and compact preference controls.

It supports multiple visual variants, semantic types, sizes, labels, left icons, right icons, counters, disabled state, rounded shape, and optional scale-on-click behavior.

## Import

```html
<script type="module" src="dist/components/toggle-button/uds-toggle-button.js"></script>
```

## Basic usage

```html
<uds-toggle-button type="primary" size="medium" variant="filled">
    Action
</uds-toggle-button>
```

## With icons

Use the `icon` and `icon-right` slots to add icons before and after the label.

```html
<uds-toggle-button type="primary" size="medium" variant="filled">
    <i slot="icon" data-lucide="copy"></i>
    Action
    <i slot="icon-right" data-lucide="chevron-down"></i>
</uds-toggle-button>
```

## With counter

Use the `counter` attribute to display a small numeric badge inside the toggle button.

```html
<uds-toggle-button type="primary" size="medium" variant="filled" counter="3">
    Action
</uds-toggle-button>
```

## Icon-only toggle button

A toggle button can be used without a text label when the icon is clear and the surrounding context explains the action.

```html
<uds-toggle-button type="primary" size="medium" variant="filled">
    <i slot="icon" data-lucide="copy"></i>
</uds-toggle-button>
```

## Types

The `type` attribute defines the semantic role and color treatment of the toggle button.

| Type | Description |
|---|---|
| `primary` | Main or default toggle button style |
| `secondary` | Lower-emphasis toggle button style |
| `danger` | Toggle button for risky, destructive, or warning-related options |

Example:

```html
<uds-toggle-button type="danger" size="medium" variant="filled">
    Delete mode
</uds-toggle-button>
```

## Variants

The `variant` attribute defines the visual style of the toggle button.

| Variant | Description |
|---|---|
| `filled` | High-emphasis toggle button with solid visual treatment |
| `outline` | Medium-emphasis toggle button with border treatment |
| `ghost` | Low-emphasis toggle button with transparent background |
| `text` | Minimal text-style toggle button |

Example:

```html
<uds-toggle-button type="primary" size="medium" variant="outline">
    Action
</uds-toggle-button>
```

## Sizes

The `size` attribute controls the height, padding, icon size, and typography of the toggle button.

| Size | Description |
|---|---|
| `small` | Compact toggle button for dense interfaces |
| `medium` | Default toggle button size |
| `large` | Larger toggle button for high-visibility actions or touch-friendly layouts |

Example:

```html
<uds-toggle-button type="primary" size="large" variant="filled">
    Action
</uds-toggle-button>
```

## States and options

### Disabled

Use the `disabled` attribute when the toggle button is unavailable.

```html
<uds-toggle-button type="primary" size="medium" variant="filled" disabled>
    Action
</uds-toggle-button>
```

### Round

Use the `round` attribute for a more rounded visual treatment.

```html
<uds-toggle-button type="primary" size="medium" variant="filled" round>
    Action
</uds-toggle-button>
```

### Scale on click

Use the `scale` attribute to add a subtle pressed animation.

```html
<uds-toggle-button type="primary" size="medium" variant="filled" scale>
    Action
</uds-toggle-button>
```

## Attributes

| Attribute | Values | Description |
|---|---|---|
| `type` | `primary`, `secondary`, `danger` | Semantic type and color treatment |
| `variant` | `filled`, `outline`, `ghost`, `text` | Visual style |
| `size` | `small`, `medium`, `large` | Toggle button size |
| `counter` | number/string | Optional counter badge |
| `disabled` | boolean | Disables the toggle button |
| `round` | boolean | Makes the component more rounded |
| `scale` | boolean | Adds scale-on-click interaction |

## Slots

| Slot | Description |
|---|---|
| default | Toggle button label |
| `icon` | Left icon |
| `icon-right` | Right icon |

## Recommended usage

Use toggle buttons for controls that switch a mode, setting, filter, or toolbar option on and off.

Use a toggle button when the control behaves like a button but also represents a persistent state.

Use regular buttons for one-time actions such as Save, Submit, Delete, or Export.

Use a switch when the control represents a persistent setting, especially in forms or settings pages.

Use segmented buttons when users need to choose exactly one option from a compact set of mutually exclusive choices.

Use icon-only toggle buttons only when the icon is familiar or the context is obvious. Otherwise, include a label.

Use `danger` only for risky modes, not for ordinary destructive commands. For destructive commands, use a danger button or menu item instead.

Avoid placing too many visually strong toggle buttons in the same area. If several options are available, use lower-emphasis variants such as `ghost` or `text`.

## Examples

### Primary filled toggle button

```html
<uds-toggle-button type="primary" size="medium" variant="filled">
    Action
</uds-toggle-button>
```

### Secondary outline toggle button

```html
<uds-toggle-button type="secondary" size="medium" variant="outline">
    Action
</uds-toggle-button>
```

### Danger toggle button

```html
<uds-toggle-button type="danger" size="medium" variant="filled">
    Delete mode
</uds-toggle-button>
```

### Toggle button with icons and counter

```html
<uds-toggle-button type="primary" size="medium" variant="filled" counter="3">
    <i slot="icon" data-lucide="copy"></i>
    Action
    <i slot="icon-right" data-lucide="chevron-down"></i>
</uds-toggle-button>
```

### Icon-only toggle button

```html
<uds-toggle-button type="primary" size="medium" variant="ghost">
    <i slot="icon" data-lucide="copy"></i>
</uds-toggle-button>
```