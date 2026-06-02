# Universal Design System

Universal Design System is an experimental framework-agnostic design system built with HTML, CSS, vanilla JavaScript, and Web Components.

The project includes design tokens, reusable interface components, and interactive demo pages for testing component variants, sizes, states, and behavior.

## Demo

Live demo:

text https://amarcus.github.io/universal-design-system/ 

## Components

Current components include:

- Button
- Split button
- Toggle
- Toggle button
- Input
- Checkbox
- Radio button
- Segmented control
- Menu
- List
- Tabs
- Form

## Project structure

text css/   tokens.css      Design tokens   index.css       Global styles and demo layout  js/   index.js        Demo logic   lucide.js       Icons   *-schema.js     Component configuration schemas  dist/   components/     Web Components  plugins/   coloris/        Color picker plugin  *.html            Component demo pages 

## Button example

html <script type="module" src="dist/components/button/uds-button.js"></script>  <uds-button type="primary" size="medium" variant="filled">     <i slot="icon" data-lucide="copy"></i>     Action     <i slot="icon-right" data-lucide="chevron-right"></i> </uds-button> 

## Button attributes

| Attribute | Values | Description |
|---|---|---|
| type | primary, secondary, danger | Defines the semantic button type |
| size | small, medium, large | Defines the button size |
| variant | filled, outline, ghost, text | Defines the visual style |
| counter | number | Shows a counter badge |

## Slots

| Slot | Description |
|---|---|
| icon | Left icon |
| icon-right | Right icon |

## Status

This is the first public version of the project. The structure, component API, and documentation may change.

The current version is intended as a public prototype and design-system playground, not yet as a production-ready npm package.

## License

MIT