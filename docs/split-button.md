# Split button

The `uds-split-button` component combines a primary action with a secondary toggle action, usually for opening a menu with additional choices.

It supports multiple visual variants, semantic types, sizes, labels, left icons, right icons, counters, loading state, disabled state for each side, rounded shape, and optional scale-on-click behavior.

## Import

```html
<script type="module" src="dist/components/button/uds-button.js"></script>
<script type="module" src="dist/components/toggle-button/uds-toggle-button.js"></script>
<script type="module" src="dist/components/split-button/uds-split-button.js"></script>
```

## Basic usage

```html
<uds-split-button type="primary" size="medium" variant="filled">
    <uds-button>Action</uds-button>
    <uds-toggle-button>
        <i slot="icon-right" data-lucide="chevron-down"></i>
    </uds-toggle-button>
</uds-split-button>
```

## With left icon

Use the `icon` slot inside the left `uds-button` to add an icon before the main action label.

```html
<uds-split-button type="primary" size="medium" variant="filled">
    <uds-button>
        <i slot="icon" data-lucide="copy"></i>
        Action
    </uds-button>

    <uds-toggle-button>
        <i slot="icon-right" data-lucide="chevron-down"></i>
    </uds-toggle-button>
</uds-split-button>
```

## With counter

Use the `counter` attribute on `uds-split-button` to display a small numeric badge.

```html
<uds-split-button type="primary" size="medium" variant="filled" counter="3">
    <uds-button>Action</uds-button>
    <uds-toggle-button>
        <i slot="icon-right" data-lucide="chevron-down"></i>
    </uds-toggle-button>
</uds-split-button>
```

## Types

The `type` attribute defines the semantic role and color treatment of the split button.

| Type | Description |
|---|---|
| `primary` | Main or default split button style |
| `secondary` | Lower-emphasis split button style |
| `danger` | Split button for destructive or risky actions |

## Variants

The `variant` attribute defines the visual style of the split button.

| Variant | Description |
|---|---|
| `filled` | High-emphasis split button with solid visual treatment |
| `outline` | Medium-emphasis split button with border treatment |
| `ghost` | Low-emphasis split button with transparent background |
| `text` | Minimal text-style split button |

## Sizes

The `size` attribute controls the height, padding, icon size, and typography of both parts of the split button.

| Size | Description |
|---|---|
| `small` | Compact split button for dense interfaces |
| `medium` | Default split button size |
| `large` | Larger split button for high-visibility actions or touch-friendly layouts |

## States and options

### Disabled left side

Use the `disabled-left` attribute when the primary action is unavailable but the secondary action should remain available.

```html
<uds-split-button type="primary" size="medium" variant="filled" disabled-left>
    <uds-button>Action</uds-button>
    <uds-toggle-button>
        <i slot="icon-right" data-lucide="chevron-down"></i>
    </uds-toggle-button>
</uds-split-button>
```

### Disabled right side

Use the `disabled-right` attribute when the secondary toggle action is unavailable but the primary action should remain available.

```html
<uds-split-button type="primary" size="medium" variant="filled" disabled-right>
    <uds-button>Action</uds-button>
    <uds-toggle-button>
        <i slot="icon-right" data-lucide="chevron-down"></i>
    </uds-toggle-button>
</uds-split-button>
```

### Loading

Use the `loading` attribute when the primary action is being processed.

```html
<uds-split-button type="primary" size="medium" variant="filled" loading>
    <uds-button>Saving</uds-button>
    <uds-toggle-button>
        <i slot="icon-right" data-lucide="chevron-down"></i>
    </uds-toggle-button>
</uds-split-button>
```

### Round

Use the `round` attribute for a more rounded visual treatment.

```html
<uds-split-button type="primary" size="medium" variant="filled" round>
    <uds-button>Action</uds-button>
    <uds-toggle-button>
        <i slot="icon-right" data-lucide="chevron-down"></i>
    </uds-toggle-button>
</uds-split-button>
```

### Scale on click

Use the `scale` attribute to add a subtle pressed animation.

```html
<uds-split-button type="primary" size="medium" variant="filled" scale>
    <uds-button>Action</uds-button>
    <uds-toggle-button>
        <i slot="icon-right" data-lucide="chevron-down"></i>
    </uds-toggle-button>
</uds-split-button>
```

## Split button attributes

| Attribute | Values | Description |
|---|---|---|
| `type` | `primary`, `secondary`, `danger` | Semantic type and color treatment |
| `variant` | `filled`, `outline`, `ghost`, `text` | Visual style |
| `size` | `small`, `medium`, `large` | Split button size |
| `counter` | number/string | Optional counter badge |
| `disabled-left` | boolean | Disables the primary left action |
| `disabled-right` | boolean | Disables the secondary right action |
| `loading` | boolean | Shows loading state |
| `round` | boolean | Makes the component more rounded |
| `scale` | boolean | Adds scale-on-click interaction |

## Child components

| Component | Description |
|---|---|
| `uds-button` | Primary left-side action |
| `uds-toggle-button` | Secondary right-side toggle action |

## Child button slots

| Slot | Description |
|---|---|
| default | Button label |
| `icon` | Left icon |
| `icon-right` | Right icon |

## Recommended usage

Use a split button when one action is primary, but related secondary actions are also available.

Use the left side for the most likely or default action.

Use the right side for opening a menu, dropdown, or alternative action list.

Use `danger` only when the primary action is destructive or risky.

Use `disabled-left` or `disabled-right` when only one part of the split button should be unavailable. If the entire control is unavailable, disable both sides.

Avoid using split buttons when the secondary action is unrelated to the main action. In that case, use two separate buttons or a menu.

Avoid overusing split buttons in simple interfaces. They are useful for power-user workflows but can be harder to understand than a normal button.

## Examples

### Primary filled split button

```html
<uds-split-button type="primary" size="medium" variant="filled">
    <uds-button>Action</uds-button>
    <uds-toggle-button>
        <i slot="icon-right" data-lucide="chevron-down"></i>
    </uds-toggle-button>
</uds-split-button>
```

### Secondary outline split button

```html
<uds-split-button type="secondary" size="medium" variant="outline">
    <uds-button>Action</uds-button>
    <uds-toggle-button>
        <i slot="icon-right" data-lucide="chevron-down"></i>
    </uds-toggle-button>
</uds-split-button>
```

### Danger split button

```html
<uds-split-button type="danger" size="medium" variant="filled">
    <uds-button>Delete</uds-button>
    <uds-toggle-button>
        <i slot="icon-right" data-lucide="chevron-down"></i>
    </uds-toggle-button>
</uds-split-button>
```

### Split button with icon and counter

```html
<uds-split-button type="primary" size="medium" variant="filled" counter="3">
    <uds-button>
        <i slot="icon" data-lucide="copy"></i>
        Copy
    </uds-button>
    <uds-toggle-button>
        <i slot="icon-right" data-lucide="chevron-down"></i>
    </uds-toggle-button>
</uds-split-button>
```

### Split button with disabled right side

```html
<uds-split-button type="primary" size="medium" variant="filled" disabled-right>
    <uds-button>Action</uds-button>
    <uds-toggle-button>
        <i slot="icon-right" data-lucide="chevron-down"></i>
    </uds-toggle-button>
</uds-split-button>
```