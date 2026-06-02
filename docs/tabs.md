# Tabs

The `uds-tabs` component is used for switching between related views, sections, panels, or browser-like pages without leaving the current context.

It supports multiple hierarchy levels, selected value, hug or fill layouts, optional delimiters, left icons, top icons, right icons, counters, tab action buttons, and disabled state.

## Import

```html
<script type="module" src="dist/components/button/uds-button.js"></script>
<script type="module" src="dist/components/tabs/uds-tabs.js"></script>
```

## Basic usage

```html
<uds-tabs level="section" value="overview">
    <uds-tab value="overview">Overview</uds-tab>
    <uds-tab value="details">Details</uds-tab>
    <uds-tab value="settings">Settings</uds-tab>
</uds-tabs>
```

## Selected value

Use the `value` attribute on `uds-tabs` to define the active tab. Each child `uds-tab` should have a matching `value` attribute.

```html
<uds-tabs level="section" value="details">
    <uds-tab value="overview">Overview</uds-tab>
    <uds-tab value="details">Details</uds-tab>
    <uds-tab value="settings">Settings</uds-tab>
</uds-tabs>
```

## Levels

The `level` attribute defines where the tabs are used in the interface hierarchy.

| Level | Description |
|---|---|
| `browser` | Top-level browser-like tabs |
| `body` | Page-level or body-level tabs |
| `section` | Section-level tabs |
| `panel` | Panel-level tabs |

Example:

```html
<uds-tabs level="body" value="overview">
    <uds-tab value="overview">Overview</uds-tab>
    <uds-tab value="details">Details</uds-tab>
    <uds-tab value="settings">Settings</uds-tab>
</uds-tabs>
```

## Browser-level tabs

Use `level="browser"` for top-level tabs. Browser-level tabs can include a close button or another tab-level action.

```html
<uds-tabs level="browser" value="overview">
    <uds-tab value="overview">
        <i slot="icon" data-lucide="star"></i>
        Overview
        <uds-button slot="button" type="secondary" variant="ghost" size="small">
            <i slot="icon" data-lucide="x"></i>
        </uds-button>
    </uds-tab>

    <uds-tab value="details">
        <i slot="icon" data-lucide="star"></i>
        Details
        <uds-button slot="button" type="secondary" variant="ghost" size="small">
            <i slot="icon" data-lucide="x"></i>
        </uds-button>
    </uds-tab>
</uds-tabs>
```

## Body-level tabs

Use `level="body"` for major sections inside a page. Body-level tabs can use top icons and counters.

```html
<uds-tabs level="body" value="overview">
    <uds-tab value="overview" counter="3">
        <i slot="icon-top" data-lucide="star"></i>
        Overview
    </uds-tab>

    <uds-tab value="details" counter="3">
        <i slot="icon-top" data-lucide="star"></i>
        Details
    </uds-tab>
</uds-tabs>
```

## Section-level tabs

Use `level="section"` for switching between related content areas inside a larger page section.

```html
<uds-tabs level="section" value="overview">
    <uds-tab value="overview">Overview</uds-tab>
    <uds-tab value="details">Details</uds-tab>
    <uds-tab value="settings">Settings</uds-tab>
</uds-tabs>
```

## Panel-level tabs

Use `level="panel"` for compact tab groups inside cards, sidebars, drawers, and panels.

```html
<uds-tabs level="panel" value="overview">
    <uds-tab value="overview">Overview</uds-tab>
    <uds-tab value="details">Details</uds-tab>
    <uds-tab value="settings">Settings</uds-tab>
</uds-tabs>
```

## With delimiters

Use the `delimiters` attribute to add visual separation between tabs.

```html
<uds-tabs level="section" value="overview" delimiters>
    <uds-tab value="overview">Overview</uds-tab>
    <uds-tab value="details">Details</uds-tab>
    <uds-tab value="settings">Settings</uds-tab>
</uds-tabs>
```

## Fill layout

Use the `fill` attribute when tabs should stretch to fill the available width.

```html
<uds-tabs level="section" value="overview" fill>
    <uds-tab value="overview">Overview</uds-tab>
    <uds-tab value="details">Details</uds-tab>
    <uds-tab value="settings">Settings</uds-tab>
</uds-tabs>
```

## Hug layout

Omit the `fill` attribute when tabs should keep their natural content width.

```html
<uds-tabs level="section" value="overview">
    <uds-tab value="overview">Overview</uds-tab>
    <uds-tab value="details">Details</uds-tab>
    <uds-tab value="settings">Settings</uds-tab>
</uds-tabs>
```

## With left icons

Use the `icon` slot to place an icon before the tab label.

```html
<uds-tabs level="section" value="overview">
    <uds-tab value="overview">
        <i slot="icon" data-lucide="star"></i>
        Overview
    </uds-tab>

    <uds-tab value="details">
        <i slot="icon" data-lucide="star"></i>
        Details
    </uds-tab>
</uds-tabs>
```

## With top icons

Use the `icon-top` slot for vertically emphasized tabs, especially at body level.

```html
<uds-tabs level="body" value="overview">
    <uds-tab value="overview">
        <i slot="icon-top" data-lucide="star"></i>
        Overview
    </uds-tab>

    <uds-tab value="details">
        <i slot="icon-top" data-lucide="star"></i>
        Details
    </uds-tab>
</uds-tabs>
```

## With right icons

Use the `icon-right` slot to place an icon after the tab label.

```html
<uds-tabs level="section" value="overview">
    <uds-tab value="overview">
        Overview
        <i slot="icon-right" data-lucide="info"></i>
    </uds-tab>

    <uds-tab value="details">
        Details
        <i slot="icon-right" data-lucide="info"></i>
    </uds-tab>
</uds-tabs>
```

## With counter

Use the `counter` attribute on `uds-tab` to display a small numeric badge.

```html
<uds-tabs level="body" value="overview">
    <uds-tab value="overview" counter="3">Overview</uds-tab>
    <uds-tab value="details" counter="8">Details</uds-tab>
    <uds-tab value="settings" counter="1">Settings</uds-tab>
</uds-tabs>
```

## With tab action button

Use the `button` slot to add a small action button inside a tab.

```html
<uds-tabs level="browser" value="overview">
    <uds-tab value="overview">
        Overview
        <uds-button slot="button" type="secondary" variant="ghost" size="small">
            <i slot="icon" data-lucide="x"></i>
        </uds-button>
    </uds-tab>
</uds-tabs>
```

## Number of tabs

A tabs group can contain two or more tabs. Keep labels short and avoid overcrowding the row.

```html
<uds-tabs level="section" value="overview">
    <uds-tab value="overview">Overview</uds-tab>
    <uds-tab value="details">Details</uds-tab>
    <uds-tab value="settings">Settings</uds-tab>
    <uds-tab value="history">History</uds-tab>
    <uds-tab value="activity">Activity</uds-tab>
</uds-tabs>
```

## Disabled state

Use the `disabled` attribute when the tabs control is unavailable.

```html
<uds-tabs level="section" value="overview" disabled>
    <uds-tab value="overview">Overview</uds-tab>
    <uds-tab value="details">Details</uds-tab>
    <uds-tab value="settings">Settings</uds-tab>
</uds-tabs>
```

## Tabs attributes

| Attribute | Values | Description |
|---|---|---|
| `level` | `browser`, `body`, `section`, `panel` | Interface hierarchy level |
| `value` | string | Currently selected tab value |
| `delimiters` | boolean | Adds visual separators between tabs |
| `fill` | boolean | Makes tabs fill the available width |
| `disabled` | boolean | Disables the tabs control |

## Tab attributes

| Attribute | Values | Description |
|---|---|---|
| `value` | string | Tab value used for selection |
| `counter` | number/string | Optional counter badge |

## Tab slots

| Slot | Description |
|---|---|
| default | Tab label |
| `icon` | Left icon |
| `icon-top` | Top icon |
| `icon-right` | Right icon |
| `button` | Small tab-level action button |

## Recommended usage

Use tabs to switch between related views at the same hierarchy level.

Use `browser` tabs for top-level tabbed pages or document-like interfaces.

Use `body` tabs for major content areas inside a page.

Use `section` tabs for related subsections.

Use `panel` tabs for compact contexts such as cards, drawers, side panels, and inspectors.

Use `fill` when the tab group should occupy a full available row. Use the default hug layout when tab labels should keep their natural width.

Use `delimiters` when tabs need stronger separation, especially in dense interfaces.

Use counters for notifications, item counts, or status summaries.

Avoid using tabs for unrelated destinations. Use navigation instead.

Avoid too many tabs. If the number grows too large, consider a menu, segmented control, or another navigation pattern.

## Examples

### Section tabs

```html
<uds-tabs level="section" value="overview">
    <uds-tab value="overview">Overview</uds-tab>
    <uds-tab value="details">Details</uds-tab>
    <uds-tab value="settings">Settings</uds-tab>
</uds-tabs>
```

### Body tabs with top icons and counters

```html
<uds-tabs level="body" value="overview">
    <uds-tab value="overview" counter="3">
        <i slot="icon-top" data-lucide="star"></i>
        Overview
    </uds-tab>

    <uds-tab value="details" counter="3">
        <i slot="icon-top" data-lucide="star"></i>
        Details
    </uds-tab>

    <uds-tab value="settings" counter="3">
        <i slot="icon-top" data-lucide="star"></i>
        Settings
    </uds-tab>
</uds-tabs>
```

### Browser tabs with close buttons

```html
<uds-tabs level="browser" value="overview">
    <uds-tab value="overview">
        <i slot="icon" data-lucide="star"></i>
        Overview
        <uds-button slot="button" type="secondary" variant="ghost" size="small">
            <i slot="icon" data-lucide="x"></i>
        </uds-button>
    </uds-tab>

    <uds-tab value="details">
        <i slot="icon" data-lucide="star"></i>
        Details
        <uds-button slot="button" type="secondary" variant="ghost" size="small">
            <i slot="icon" data-lucide="x"></i>
        </uds-button>
    </uds-tab>
</uds-tabs>
```

### Fill tabs with delimiters

```html
<uds-tabs level="section" value="overview" fill delimiters>
    <uds-tab value="overview">Overview</uds-tab>
    <uds-tab value="details">Details</uds-tab>
    <uds-tab value="settings">Settings</uds-tab>
</uds-tabs>
```