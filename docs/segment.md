# Segmented button

The `uds-segment` component is used for selecting one option from a compact group of related actions or views.

It supports multiple visual variants, semantic types, sizes, two or more buttons, selected value, optional icons, counters, disabled state, rounded shape, and configurable width.

## Import

```html
<script type="module" src="dist/components/button/uds-button.js"></script>
<script type="module" src="dist/components/segment/uds-segment.js"></script>
```

## Basic usage

```html
<uds-segment type="primary" size="medium" variant="filled" value="day">
    <uds-button value="day">Day</uds-button>
    <uds-button value="week">Week</uds-button>
    <uds-button value="month">Month</uds-button>
</uds-segment>
```

## Selected value

Use the `value` attribute on `uds-segment` to define the selected button. Each child `uds-button` should have a matching `value` attribute.

```html
<uds-segment type="primary" size="medium" variant="filled" value="week">
    <uds-button value="day">Day</uds-button>
    <uds-button value="week">Week</uds-button>
    <uds-button value="month">Month</uds-button>
</uds-segment>
```

## With icons

Use the `icon` and `icon-right` slots inside child buttons to add icons to each segment item.

```html
<uds-segment type="primary" size="medium" variant="filled" value="day">
    <uds-button value="day">
        <i slot="icon" data-lucide="calendar-days"></i>
        Day
    </uds-button>

    <uds-button value="week">
        <i slot="icon" data-lucide="calendar-range"></i>
        Week
    </uds-button>

    <uds-button value="month">
        <i slot="icon" data-lucide="calendar"></i>
        Month
    </uds-button>
</uds-segment>
```

## With counters

Use the `counter` attribute on child buttons to display small numeric badges.

```html
<uds-segment type="primary" size="medium" variant="filled" value="day">
    <uds-button value="day" counter="3">Day</uds-button>
    <uds-button value="week" counter="7">Week</uds-button>
    <uds-button value="month" counter="12">Month</uds-button>
</uds-segment>
```

## More than three buttons

A segmented button can contain two or more child buttons. Keep the labels short, especially when the component is used in a narrow layout.

```html
<uds-segment type="primary" size="medium" variant="filled" value="week">
    <uds-button value="day">Day</uds-button>
    <uds-button value="week">Week</uds-button>
    <uds-button value="month">Month</uds-button>
    <uds-button value="year">Year</uds-button>
</uds-segment>
```

## Types

The `type` attribute defines the semantic role and color treatment of the segmented button.

| Type | Description |
|---|---|
| `primary` | Main or default segmented control style |
| `secondary` | Lower-emphasis segmented control style |
| `danger` | Segmented control for risky or warning-related choices |

## Variants

The `variant` attribute defines the visual style of the segmented button.

| Variant | Description |
|---|---|
| `filled` | High-emphasis segmented control with solid visual treatment |
| `outline` | Medium-emphasis segmented control with border treatment |
| `ghost` | Low-emphasis segmented control with transparent background |
| `text` | Minimal text-style segmented control |

## Sizes

The `size` attribute controls the height, padding, icon size, and typography of the segmented button and its child buttons.

| Size | Description |
|---|---|
| `small` | Compact segmented control for dense interfaces |
| `medium` | Default segmented control size |
| `large` | Larger segmented control for high-visibility settings or touch-friendly layouts |

## States and options

### Disabled

Use the `disabled` attribute when the entire segmented button is unavailable.

```html
<uds-segment type="primary" size="medium" variant="filled" value="day" disabled>
    <uds-button value="day">Day</uds-button>
    <uds-button value="week">Week</uds-button>
    <uds-button value="month">Month</uds-button>
</uds-segment>
```

### Round

Use the `round` attribute for a more rounded visual treatment.

```html
<uds-segment type="primary" size="medium" variant="filled" value="day" round>
    <uds-button value="day">Day</uds-button>
    <uds-button value="week">Week</uds-button>
    <uds-button value="month">Month</uds-button>
</uds-segment>
```

### Width

Use inline width or an external CSS class when the segmented button should occupy a fixed width.

```html
<uds-segment type="primary" size="medium" variant="filled" value="day" style="width: 300px;">
    <uds-button value="day">Day</uds-button>
    <uds-button value="week">Week</uds-button>
    <uds-button value="month">Month</uds-button>
</uds-segment>
```

## Segment attributes

| Attribute | Values | Description |
|---|---|---|
| `type` | `primary`, `secondary`, `danger` | Semantic type and color treatment |
| `variant` | `filled`, `outline`, `ghost`, `text` | Visual style |
| `size` | `small`, `medium`, `large` | Segmented button size |
| `value` | string | Currently selected child button value |
| `disabled` | boolean | Disables the segmented button |
| `round` | boolean | Makes the component more rounded |

## Child button attributes

| Attribute | Values | Description |
|---|---|---|
| `value` | string | Value used for selection |
| `counter` | number/string | Optional counter badge |

## Child button slots

| Slot | Description |
|---|---|
| default | Button label |
| `icon` | Left icon |
| `icon-right` | Right icon |

## Recommended usage

Use segmented buttons when users need to switch between closely related views, filters, modes, or time ranges.

Use a segmented button when exactly one option should be active at a time.

Use short labels. Segmented controls work best with compact choices such as Day, Week, Month or List, Grid, Map.

Use radio buttons instead when options need longer explanations or when the control appears inside a form with multiple fields.

Use tabs instead when switching between larger sections of content.

Avoid using too many items. Two to five options usually work best; larger groups become hard to scan and tap.

Use `danger` only for risky mode choices, not for ordinary destructive actions. For destructive commands, use a danger button or menu item instead.

## Examples

### Primary filled segmented button

```html
<uds-segment type="primary" size="medium" variant="filled" value="day">
    <uds-button value="day">Day</uds-button>
    <uds-button value="week">Week</uds-button>
    <uds-button value="month">Month</uds-button>
</uds-segment>
```

### Secondary outline segmented button

```html
<uds-segment type="secondary" size="medium" variant="outline" value="week">
    <uds-button value="day">Day</uds-button>
    <uds-button value="week">Week</uds-button>
    <uds-button value="month">Month</uds-button>
</uds-segment>
```

### Large segmented button

```html
<uds-segment type="primary" size="large" variant="filled" value="month">
    <uds-button value="day">Day</uds-button>
    <uds-button value="week">Week</uds-button>
    <uds-button value="month">Month</uds-button>
</uds-segment>
```

### Segmented button with icons and counters

```html
<uds-segment type="primary" size="medium" variant="filled" value="day">
    <uds-button value="day" counter="3">
        <i slot="icon" data-lucide="calendar-days"></i>
        Day
    </uds-button>

    <uds-button value="week" counter="7">
        <i slot="icon" data-lucide="calendar-range"></i>
        Week
    </uds-button>

    <uds-button value="month" counter="12">
        <i slot="icon" data-lucide="calendar"></i>
        Month
    </uds-button>
</uds-segment>
```