# Toggle

The `uds-toggle` component is used for switching a setting, preference, or binary state on and off.

It supports multiple sizes, label text, right-side icon, counter, description, disabled state, and optional scale-on-click behavior.

## Import

```html
<script type="module" src="dist/components/toggle/uds-toggle.js"></script>
```

## Basic usage

```html
<uds-toggle size="medium">
    Label
</uds-toggle>
```

## With right icon

Use the `icon-right` slot to place an icon after the label.

```html
<uds-toggle size="medium">
    Label
    <i slot="icon-right" data-lucide="info"></i>
</uds-toggle>
```

## With counter

Use the `counter` attribute to display a small numeric badge inside the toggle component.

```html
<uds-toggle size="medium" counter="3">
    Label
</uds-toggle>
```

## With description

Use the `description` attribute to add supporting text to the toggle.

```html
<uds-toggle size="medium" description="Description">
    Label
</uds-toggle>
```

## Sizes

The `size` attribute controls the toggle size, spacing, icon size, and typography.

| Size | Description |
|---|---|
| `small` | Compact toggle for dense interfaces |
| `medium` | Default toggle size |
| `large` | Larger toggle for high-visibility settings or touch-friendly layouts |

Example:

```html
<uds-toggle size="large">
    Label
</uds-toggle>
```

## States and options

### Disabled

Use the `disabled` attribute when the toggle is unavailable.

```html
<uds-toggle size="medium" disabled>
    Label
</uds-toggle>
```

### Scale on click

Use the `scale` attribute to add a subtle pressed animation.

```html
<uds-toggle size="medium" scale>
    Label
</uds-toggle>
```

## Attributes

| Attribute | Values | Description |
|---|---|---|
| `size` | `small`, `medium`, `large` | Toggle size |
| `counter` | number/string | Optional counter badge |
| `description` | string | Optional supporting text |
| `disabled` | boolean | Disables the toggle |
| `scale` | boolean | Adds scale-on-click interaction |

## Slots

| Slot | Description |
|---|---|
| default | Toggle label |
| `icon-right` | Right icon |

## Recommended usage

Use toggles for persistent on/off settings, preferences, and binary states.

Use a toggle when changing the value has an immediate effect or represents a saved setting.

Use a checkbox instead when the option is part of a form and will be submitted together with other fields.

Use a toggle button instead when the control belongs to a toolbar, view switcher, filter bar, or compact action area.

Keep labels short and clear. The label should describe the state or setting, not the mechanical action.

Use descriptions when the setting needs explanation, but avoid long text inside dense settings panels.

Use counters only when the toggle represents a group, category, or number of related items.

Avoid using toggles for destructive actions. Use buttons or confirmation flows for destructive commands.

## Examples

### Small toggle

```html
<uds-toggle size="small" counter="3">
    Label
    <i slot="icon-right" data-lucide="info"></i>
</uds-toggle>
```

### Medium toggle

```html
<uds-toggle size="medium" counter="3">
    Label
    <i slot="icon-right" data-lucide="info"></i>
</uds-toggle>
```

### Large toggle

```html
<uds-toggle size="large" counter="3">
    Label
    <i slot="icon-right" data-lucide="info"></i>
</uds-toggle>
```

### Toggle with description

```html
<uds-toggle size="medium" description="Description">
    Label
</uds-toggle>
```

### Disabled toggle

```html
<uds-toggle size="medium" disabled>
    Label
</uds-toggle>
```