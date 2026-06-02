# Input

The `uds-input` component is used for text entry, search fields, form fields, filters, and editable values.

It supports multiple visual variants, semantic types, sizes, placeholder text, input types, left icons, right-side action buttons, clear button, counter, description, error state, disabled state, read-only state, rounded shape, and optional scale-on-click behavior.

## Import

```html
<script type="module" src="dist/components/input/uds-input.js"></script>
<script type="module" src="dist/components/button/uds-button.js"></script>
```

## Basic usage

```html
<uds-input type="primary" variant="filled" size="medium" placeholder="Placeholder"></uds-input>
```

## With left icon

Use the `icon` slot to place an icon before the input value.

```html
<uds-input type="primary" variant="filled" size="medium" placeholder="Search">
    <i slot="icon" data-lucide="search"></i>
</uds-input>
```

## With right button

Use the `button` slot to place an action button inside the input, usually on the right side.

```html
<uds-input type="primary" variant="filled" size="medium" placeholder="Placeholder">
    <i slot="icon" data-lucide="search"></i>

    <uds-button slot="button" type="secondary" variant="text" size="small">
        <i slot="icon" data-lucide="mic"></i>
    </uds-button>
</uds-input>
```

## With counter

Use the `counter` attribute to display a small numeric badge or character count.

```html
<uds-input type="primary" variant="filled" size="medium" placeholder="Placeholder" counter="3">
    <i slot="icon" data-lucide="search"></i>
</uds-input>
```

## With description

Use the `description` attribute to add supporting text to the input.

```html
<uds-input
    type="primary"
    variant="filled"
    size="medium"
    placeholder="Placeholder"
    description="Description">
</uds-input>
```

## Error state

Use the `error` attribute to show an error message or error state.

```html
<uds-input
    type="danger"
    variant="filled"
    size="medium"
    placeholder="Placeholder"
    error="Error">
</uds-input>
```

## Input types

Use the `input-type` attribute to define the native input behavior.

```html
<uds-input
    type="primary"
    variant="filled"
    size="medium"
    input-type="email"
    placeholder="Email">
</uds-input>
```

Supported input types:

| Input type | Description |
|---|---|
| `text` | Default text input |
| `password` | Password input |
| `email` | Email input |
| `tel` | Telephone input |
| `url` | URL input |
| `search` | Search input |
| `number` | Numeric input |

## Types

The `type` attribute defines the semantic role and color treatment of the input.

| Type | Description |
|---|---|
| `primary` | Main or default input style |
| `secondary` | Lower-emphasis input style |
| `danger` | Error, destructive, or warning-related input style |

Example:

```html
<uds-input type="danger" variant="filled" size="medium" placeholder="Placeholder" error="Error"></uds-input>
```

## Variants

The `variant` attribute defines the visual style of the input.

| Variant | Description |
|---|---|
| `filled` | High-emphasis input with solid visual treatment |
| `outline` | Medium-emphasis input with border treatment |
| `ghost` | Low-emphasis input with transparent background |
| `text` | Minimal text-style input |

Example:

```html
<uds-input type="primary" variant="outline" size="medium" placeholder="Placeholder"></uds-input>
```

## Sizes

The `size` attribute controls the input height, padding, icon size, button size, and typography.

| Size | Description |
|---|---|
| `small` | Compact input for dense interfaces |
| `medium` | Default input size |
| `large` | Larger input for high-visibility fields or touch-friendly layouts |

Example:

```html
<uds-input type="primary" variant="filled" size="large" placeholder="Placeholder"></uds-input>
```

## States and options

### Disabled

Use the `disabled` attribute when the input is unavailable.

```html
<uds-input type="primary" variant="filled" size="medium" placeholder="Placeholder" disabled></uds-input>
```

### Read-only

Use the `readonly` attribute when the value can be viewed but not edited.

```html
<uds-input type="primary" variant="filled" size="medium" value="Read-only value" readonly></uds-input>
```

### Clear button

Use the `clear-button` attribute when users should be able to quickly clear the input value.

```html
<uds-input
    type="primary"
    variant="filled"
    size="medium"
    placeholder="Search"
    clear-button>
</uds-input>
```

### Round

Use the `round` attribute for a more rounded visual treatment.

```html
<uds-input type="primary" variant="filled" size="medium" placeholder="Placeholder" round></uds-input>
```

### Scale on click

Use the `scale` attribute to add a subtle pressed interaction.

```html
<uds-input type="primary" variant="filled" size="medium" placeholder="Placeholder" scale></uds-input>
```

## Attributes

| Attribute | Values | Description |
|---|---|---|
| `type` | `primary`, `secondary`, `danger` | Semantic type and color treatment |
| `variant` | `filled`, `outline`, `ghost`, `text` | Visual style |
| `size` | `small`, `medium`, `large` | Input size |
| `placeholder` | string | Placeholder text |
| `value` | string | Input value |
| `input-type` | `text`, `password`, `email`, `tel`, `url`, `search`, `number` | Native input type |
| `counter` | number/string | Optional counter badge or character count |
| `description` | string | Optional supporting text |
| `error` | string | Optional error message |
| `disabled` | boolean | Disables the input |
| `readonly` | boolean | Makes the input read-only |
| `clear-button` | boolean | Shows a clear button |
| `round` | boolean | Makes the component more rounded |
| `scale` | boolean | Adds scale-on-click interaction |

## Slots

| Slot | Description |
|---|---|
| `icon` | Left icon |
| `button` | Right-side action button |

## Recommended usage

Use inputs for free-form text entry, search, filtering, URLs, phone numbers, emails, passwords, and numeric values.

Use `placeholder` to show an example or hint, but do not use it as a replacement for a visible label in forms.

Use a left icon when it helps identify the field purpose, such as search, email, phone, or URL.

Use a right button for secondary field actions such as voice input, reveal password, copy, clear, or open picker.

Use `clear-button` for search and filter inputs where clearing the field is a common action.

Use `danger` and `error` for validation errors or warning-related inputs.

Use `readonly` when the value should be selectable or copyable but not editable.

Use `disabled` when the field is unavailable and should not be interactive.

Avoid overloading one input with too many visual elements. If the field already has an icon, counter, description, and action button, make sure the purpose remains clear.

## Examples

### Primary filled input

```html
<uds-input type="primary" variant="filled" size="medium" placeholder="Placeholder">
    <i slot="icon" data-lucide="search"></i>
</uds-input>
```

### Secondary outline input

```html
<uds-input type="secondary" variant="outline" size="medium" placeholder="Placeholder">
    <i slot="icon" data-lucide="search"></i>
</uds-input>
```

### Danger input with error

```html
<uds-input
    type="danger"
    variant="filled"
    size="medium"
    placeholder="Placeholder"
    error="Error">
    <i slot="icon" data-lucide="search"></i>
</uds-input>
```

### Search input with action button

```html
<uds-input type="primary" variant="filled" size="medium" input-type="search" placeholder="Search" counter="3">
    <i slot="icon" data-lucide="search"></i>

    <uds-button slot="button" type="secondary" variant="text" size="small">
        <i slot="icon" data-lucide="mic"></i>
    </uds-button>
</uds-input>
```

### Email input

```html
<uds-input type="primary" variant="filled" size="medium" input-type="email" placeholder="Email">
    <i slot="icon" data-lucide="mail"></i>
</uds-input>
```

### Password input

```html
<uds-input type="primary" variant="filled" size="medium" input-type="password" placeholder="Password">
    <i slot="icon" data-lucide="lock"></i>

    <uds-button slot="button" type="secondary" variant="text" size="small">
        <i slot="icon" data-lucide="eye"></i>
    </uds-button>
</uds-input>
```

### Read-only input

```html
<uds-input type="secondary" variant="filled" size="medium" value="Read-only value" readonly></uds-input>
```

### Disabled input

```html
<uds-input type="secondary" variant="filled" size="medium" placeholder="Placeholder" disabled></uds-input>
```