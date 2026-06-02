# List

The `uds-list` component is used for menus, dropdowns, listboxes, navigation lists, selectable option lists, and nested item structures.

It supports multiple visual variants, semantic types, sections, selected items, optional checkmarks, left icons, action buttons, notes, descriptions, nested sublists, listbox modes, rounded shape, and optional scale-on-click behavior.

## Import

```html
<script type="module" src="dist/components/list/uds-list-item.js"></script>
<script type="module" src="dist/components/list/uds-list-section.js"></script>
<script type="module" src="dist/components/list/uds-list.js"></script>
<script type="module" src="dist/components/button/uds-button.js"></script>
```

## Basic usage

```html
<uds-list variant="filled" type="primary">
    <uds-list-section label="Section">
        <uds-list-item selected>
            Label
        </uds-list-item>

        <uds-list-item>
            Label
        </uds-list-item>
    </uds-list-section>
</uds-list>
```

## With sections

Use `uds-list-section` to group related list items. The `label` attribute defines the section title.

```html
<uds-list variant="filled" type="primary">
    <uds-list-section label="Section">
        <uds-list-item selected>Selected item</uds-list-item>
        <uds-list-item>Item</uds-list-item>
        <uds-list-item>Item</uds-list-item>
    </uds-list-section>
</uds-list>
```

## With left icons

Use the `icon` slot to place an icon before the item label.

```html
<uds-list variant="filled" type="primary">
    <uds-list-section label="Section">
        <uds-list-item selected>
            <i slot="icon" data-lucide="copy"></i>
            Label
        </uds-list-item>
    </uds-list-section>
</uds-list>
```

## With action buttons

Use the `button-1` and `button-2` slots to add small action buttons to the right side of a list item.

```html
<uds-list variant="filled" type="primary">
    <uds-list-section label="Section">
        <uds-list-item selected>
            <i slot="icon" data-lucide="copy"></i>
            Label

            <uds-button slot="button-1" type="secondary" variant="text" size="small">
                <i slot="icon" data-lucide="pencil"></i>
            </uds-button>

            <uds-button slot="button-2" type="secondary" variant="text" size="small">
                <i slot="icon" data-lucide="trash-2"></i>
            </uds-button>
        </uds-list-item>
    </uds-list-section>
</uds-list>
```

## With note

Use the `note` attribute to display a short note, count, shortcut, or small secondary value.

```html
<uds-list variant="filled" type="primary">
    <uds-list-section label="Section">
        <uds-list-item note="1" selected>
            Label
        </uds-list-item>
    </uds-list-section>
</uds-list>
```

## Nested list

Use the `sublist` attribute to connect a parent list item to a nested `uds-list`.

```html
<uds-list variant="filled" type="primary">
    <uds-list-section label="Section">
        <uds-list-item sublist="sublist1">
            Parent item
        </uds-list-item>
    </uds-list-section>

    <uds-list sublist="sublist1">
        <uds-list-section>
            <uds-list-item>Nested item</uds-list-item>
            <uds-list-item>Nested item</uds-list-item>
        </uds-list-section>
    </uds-list>
</uds-list>
```

## Types

| Type | Description |
|---|---|
| `primary` | Main or default list style |
| `secondary` | Lower-emphasis list style |

## Variants

| Variant | Description |
|---|---|
| `filled` | High-emphasis list with solid visual treatment |
| `outline` | Medium-emphasis list with border treatment |
| `ghost` | Low-emphasis list with transparent background |
| `text` | Minimal text-style list |

## Modes

| Mode | Description |
|---|---|
| `dropdown` | Dropdown-style list, including optional nested lists |
| `listbox` | Selectable listbox style |
| `listbox-classic` | Classic listbox style |

Example:

```html
<uds-list variant="filled" type="primary" mode="listbox">
    <uds-list-section label="Section">
        <uds-list-item selected>Option A</uds-list-item>
        <uds-list-item>Option B</uds-list-item>
    </uds-list-section>
</uds-list>
```

## States and options

### Selected item

Use the `selected` attribute on `uds-list-item` to show the current item.

```html
<uds-list variant="filled" type="primary">
    <uds-list-section label="Section">
        <uds-list-item selected>Selected item</uds-list-item>
        <uds-list-item>Item</uds-list-item>
    </uds-list-section>
</uds-list>
```

### Mutually exclusive

Use `exclusive` when only one item can be selected at a time.

```html
<uds-list variant="filled" type="primary" exclusive>
    <uds-list-section label="Section">
        <uds-list-item selected>Option A</uds-list-item>
        <uds-list-item>Option B</uds-list-item>
    </uds-list-section>
</uds-list>
```

### Round

Use the `round` attribute for a more rounded visual treatment.

```html
<uds-list variant="filled" type="primary" round>
    <uds-list-section label="Section">
        <uds-list-item selected>Label</uds-list-item>
    </uds-list-section>
</uds-list>
```

### Scale on click

Use the `scale` attribute to add a subtle pressed animation.

```html
<uds-list variant="filled" type="primary" scale>
    <uds-list-section label="Section">
        <uds-list-item selected>Label</uds-list-item>
    </uds-list-section>
</uds-list>
```

## List attributes

| Attribute | Values | Description |
|---|---|---|
| `type` | `primary`, `secondary` | Semantic type and color treatment |
| `variant` | `filled`, `outline`, `ghost`, `text` | Visual style |
| `mode` | `dropdown`, `listbox`, `listbox-classic` | List behavior and presentation mode |
| `exclusive` | boolean | Makes selection mutually exclusive |
| `sublist` | string | Identifies a nested list |
| `round` | boolean | Makes the component more rounded |
| `scale` | boolean | Adds scale-on-click interaction |

## List item attributes

| Attribute | Values | Description |
|---|---|---|
| `selected` | boolean | Marks the item as selected |
| `note` | string | Optional note, count, shortcut, or secondary value |
| `description` | string | Optional supporting text |
| `sublist` | string | Links the item to a nested list |

## Section attributes

| Attribute | Values | Description |
|---|---|---|
| `label` | string | Optional section title |

## Slots

### `uds-list-item`

| Slot | Description |
|---|---|
| default | List item label |
| `icon` | Left icon |
| `button-1` | First right-side action button |
| `button-2` | Second right-side action button |

## Recommended usage

Use lists for grouped navigation, dropdown menus, selectable options, command lists, and structured item collections.

Use `selected` to clearly show the current item or active option.

Use sections when the list contains multiple groups of related items.

Use notes for short secondary values such as counts, keyboard shortcuts, or compact metadata.

Use action buttons only when item-level actions are important. Avoid overloading simple selection lists with too many controls.

Use nested lists carefully. They are useful for dropdown menus and hierarchical navigation, but can become difficult to scan if overused.

## Examples

### Primary filled list

```html
<uds-list variant="filled" type="primary">
    <uds-list-section label="Section">
        <uds-list-item selected>Selected item</uds-list-item>
        <uds-list-item>Item</uds-list-item>
        <uds-list-item>Item</uds-list-item>
    </uds-list-section>
</uds-list>
```

### Secondary outline list

```html
<uds-list variant="outline" type="secondary">
    <uds-list-section label="Section">
        <uds-list-item selected>Selected item</uds-list-item>
        <uds-list-item>Item</uds-list-item>
    </uds-list-section>
</uds-list>
```

### List item with icon, note, and actions

```html
<uds-list variant="filled" type="primary">
    <uds-list-section label="Section">
        <uds-list-item note="1" selected>
            <i slot="icon" data-lucide="copy"></i>
            Label

            <uds-button slot="button-1" type="secondary" variant="text" size="small">
                <i slot="icon" data-lucide="pencil"></i>
            </uds-button>

            <uds-button slot="button-2" type="secondary" variant="text" size="small">
                <i slot="icon" data-lucide="trash-2"></i>
            </uds-button>
        </uds-list-item>
    </uds-list-section>
</uds-list>
```

### Nested dropdown list

```html
<uds-list variant="filled" type="primary" mode="dropdown">
    <uds-list-section label="Section">
        <uds-list-item sublist="sublist1">
            Parent item
        </uds-list-item>
    </uds-list-section>

    <uds-list sublist="sublist1">
        <uds-list-section>
            <uds-list-item>Nested item</uds-list-item>
            <uds-list-item>Nested item</uds-list-item>
        </uds-list-section>
    </uds-list>
</uds-list>
```