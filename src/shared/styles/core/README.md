# Core Layer

`core/` contains CSS-emitting partials that form the global baseline.

The usual split is:

- `core/_reset.scss`;
- `core/_common.scss`;
- `core/_typography.scss`;
- `core/_css-variables.scss`;
- `core/_utilities.scss`;
- `core/_media-utilities.scss`.

`main.scss` should load this layer once through `@use 'core';`.
