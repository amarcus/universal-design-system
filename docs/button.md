# Button

The `uds-button` component is used for primary actions, secondary actions, destructive actions, and lightweight text-style actions.

It supports multiple visual variants, semantic types, sizes, icons, counters, loading state, disabled state, rounded shape, and optional scale-on-click behavior.

## Import

```html
<script type="module" src="dist/components/button/uds-button.js"></script>
```

## Basic usage

```html
<uds-button type="primary" size="medium" variant="filled">
    Action
</uds-button>
```

## With icons

The button supports left and right icons through named slots.

```html
<uds-button type="primary" size="medium" variant="filled">
    <i slot="icon" data-lucide="copy"></i>
    Action
    <i slot="icon-right" data-lucide="chevron-right"></i>
</uds-button>
```

## With counter

Use the `counter` attribute to display a small numeric badge inside the button.

```html
<uds-button type="primary" size="medium" variant="filled" counter="3">
    Action
</uds-button>
```

## Types

The `type` attribute defines the semantic role and color treatment of the button.

| Type | Description |
|---|---|
| `primary` | Main action on the page or in a section |
| `secondary` | Supporting action with lower visual priority |
| `danger` | Destructive or potentially dangerous action |

Example:

```html
<uds-button type="danger" size="medium" variant="filled">
    Delete
</uds-button>
```

## Variants

The `variant` attribute defines the visual style of the button.

| Variant | Description |
|---|---|
| `filled` | High-emphasis button with solid background |
| `outline` | Medium-emphasis button with border |
| `ghost` | Low-emphasis button with transparent background |
| `text` | Minimal text-style action |

Example:

```html
<uds-button type="primary" size="medium" variant="outline">
    Action
</uds-button>
```

## Sizes

The `size` attribute controls the button height, padding, icon size, and typography.

| Size | Description |
|---|---|
| `small` | Compact button for dense interfaces |
| `medium` | Default button size |
| `large` | Prominent button for high-visibility actions |

Example:

```html
<uds-button type="primary" size="large" variant="filled">
    Action
</uds-button>
```

## States and options

### Disabled

Use the `disabled` attribute when the action is unavailable.

```html
<uds-button type="primary" size="medium" variant="filled" disabled>
    Action
</uds-button>
```

### Loading

Use the `loading` attribute when the action is being processed.

```html
<uds-button type="primary" size="medium" variant="filled" loading>
    Saving
</uds-button>
```

### Round

Use the `round` attribute for fully rounded buttons.

```html
<uds-button type="primary" size="medium" variant="filled" round>
    Action
</uds-button>
```

### Scale on click

Use the `scale` attribute to add a subtle pressed animation.

```html
<uds-button type="primary" size="medium" variant="filled" scale>
    Action
</uds-button>
```

## Attributes

| Attribute | Values | Description |
|---|---|---|
| `type` | `primary`, `secondary`, `danger` | Semantic type and color treatment |
| `variant` | `filled`, `outline`, `ghost`, `text` | Visual style |
| `size` | `small`, `medium`, `large` | Button size |
| `counter` | number/string | Optional counter badge |
| `disabled` | boolean | Disables the button |
| `loading` | boolean | Shows loading state |
| `round` | boolean | Makes the button fully rounded |
| `scale` | boolean | Adds scale-on-click interaction |

## Slots

| Slot | Description |
|---|---|
| default | Button label |
| `icon` | Left icon |
| `icon-right` | Right icon |

## Recommended usage

Use `filled primary` for the most important action on a page or inside a component.

Use `secondary` for alternative actions that should remain visible but less dominant.

Use `danger` only for destructive actions such as delete, remove, reset, or irreversible changes.

Use `ghost` and `text` variants for low-emphasis actions, toolbar actions, inline actions, and secondary navigation-like controls.

Avoid placing too many filled buttons in the same area. When several actions are present, keep only the main action visually dominant.

## Examples

### Primary filled button

```html
<uds-button type="primary" size="medium" variant="filled">
    Save changes
</uds-button>
```

### Secondary outline button

```html
<uds-button type="secondary" size="medium" variant="outline">
    Cancel
</uds-button>
```

### Danger button

```html
<uds-button type="danger" size="medium" variant="filled">
    Delete
</uds-button>
```

### Icon button with counter

```html
<uds-button type="primary" size="medium" variant="filled" counter="3">
    <i slot="icon" data-lucide="copy"></i>
    Copy
</uds-button>
```