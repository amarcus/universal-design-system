# Universal Design System

Universal Design System is an experimental framework-agnostic design system built with HTML, CSS, vanilla JavaScript, and Web Components.

It includes design tokens, reusable interface components, and interactive demo pages for testing component variants, sizes, states, and behavior.

Related resources:

- [Book on Amazon](https://www.amazon.com/dp/B0GZK7YKZ7)
- [Universal Design System in Figma](https://www.figma.com/community/file/1515890621122401030/universal-design-system)

## Demo

Live demo:  
https://amarcus.github.io/universal-design-system/

## Components

| Component | Demo | Documentation |
|---|---|---|
| Button | [Demo](button.html) | [Docs](docs/button.md) |
| Input | [Demo](input.html) | [Docs](docs/input.md) |
| Checkbox | [Demo](checkbox.html) | [Docs](docs/checkbox.md) |
| Radio button | [Demo](radiobutton.html) | [Docs](docs/radio.md) |
| Toggle | [Demo](toggle.html) | [Docs](docs/toggle.md) |
| Toggle button | [Demo](toggle-button.html) | [Docs](docs/toggle-button.md) |
| Segmented button | [Demo](segment.html) | [Docs](docs/segment.md) |
| Split button | [Demo](split-button.html) | [Docs](docs/split-button.md) |
| Menu | [Demo](menu.html) | [Docs](docs/menu.md) |
| List | [Demo](list.html) | [Docs](docs/list.md) |
| Tabs | [Demo](tabs.html) | [Docs](docs/tabs.md) |
| Form | [Demo](form.html) | [Docs](docs/form.md) |

## Example

```html
<script type="module" src="dist/components/button/uds-button.js"></script>

<uds-button type="primary" size="medium" variant="filled">
    <i slot="icon" data-lucide="copy"></i>
    Action
    <i slot="icon-right" data-lucide="chevron-right"></i>
</uds-button>
```

## Project structure

```text
css/
  tokens.css      Design tokens
  index.css       Global styles and demo layout

js/
  index.js        Demo logic
  lucide.js       Icons
  *-schema.js     Component configuration schemas

dist/
  components/     Web Components

plugins/
  coloris/        Third-party UI plugins

docs/
  Component documentation

*.html            Component demo pages
```

## Status

This is the first public version of the project. The structure, component API, and documentation may change.

The current version is intended as a public prototype and design-system playground, not yet as a production-ready npm package.

## License

MIT