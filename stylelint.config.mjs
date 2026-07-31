/** @type {import('stylelint').Config} */
export default {
  //region Base Config
  // Базовая конфигурация для SCSS-файлов и CSS Modules
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-scss', 'stylelint-order'],
  //endregion

  //region Parsing / Syntax
  overrides: [{ files: ['**/*.scss'], customSyntax: 'postcss-scss' }],
  //endregion

  //region Disable Reports
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  //endregion

  rules: {
    //region Organization / Structure
    'max-nesting-depth': 5,
    'selector-max-compound-selectors': 3,
    'alpha-value-notation': 'number',
    //endregion

    //region SCSS Patterns
    'scss/at-mixin-pattern': '^[_a-z]+([a-z0-9-]+)*$',
    'scss/at-function-pattern': '^[_a-z]+([a-z0-9-]+)*$',
    'scss/dollar-variable-pattern': '^[a-z0-9-]+$',
    'scss/percent-placeholder-pattern': '^[a-z0-9-]+$',
    // Разрешаем kebab-case, BEM и lowerCamelCase для CSS Modules.
    'selector-class-pattern': [
      '^(-|_)?([0-9a-z]+((--|__|-|_)[a-z0-9]+)*|[a-z][a-z0-9]*([A-Z][a-z0-9]*)+)$',
      {
        message:
          'Ожидается kebab-case/BEM или camelCase для CSS Modules (например: .block__element--mod, .block__element_mod, ._mod, .stateHeader)',
      },
    ],
    //endregion

    //region Disabled rules
    'scss/double-slash-comment-empty-line-before': null,
    'scss/double-slash-comment-whitespace-inside': null,
    'scss/comment-no-empty': null,
    'scss/dollar-variable-empty-line-before': null,
    'no-descending-specificity': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'block-no-empty': null,
    'at-rule-empty-line-before': null,
    'custom-property-empty-line-before': null,
    'no-empty-source': null,
    //endregion

    //region Order in SCSS blocks
    'order/order': [
      'custom-properties',
      'dollar-variables',
      { type: 'at-rule', name: 'use' },
      { type: 'at-rule', name: 'forward' },
      { type: 'at-rule', name: 'extend' },
      { type: 'at-rule', name: 'include', hasBlock: false },
      'declarations',
      { type: 'at-rule', name: 'include', hasBlock: true },
      'rules',
      'at-rules',
    ],
    //endregion

    //region Properties order
    'order/properties-order': [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'flex',
      'flex-grow',
      'flex-shrink',
      'flex-basis',
      'flex-direction',
      'flex-wrap',
      'align-items',
      'justify-content',
      'align-content',
      'gap',
      'row-gap',
      'column-gap',
      'grid',
      'grid-area',
      'grid-template',
      'grid-template-areas',
      'grid-template-rows',
      'grid-template-columns',
      'grid-auto-rows',
      'grid-auto-columns',
      'grid-auto-flow',
      'grid-column',
      'grid-column-start',
      'grid-column-end',
      'grid-row',
      'grid-row-start',
      'grid-row-end',
      'box-sizing',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'overflow',
      'overflow-x',
      'overflow-y',
      'font',
      'font-family',
      'font-size',
      'font-weight',
      'line-height',
      'letter-spacing',
      'text-align',
      'text-transform',
      'text-decoration',
      'white-space',
      'color',
      'background',
      'background-color',
      'background-image',
      'background-size',
      'background-position',
      'background-repeat',
      'border',
      'border-width',
      'border-style',
      'border-color',
      'border-radius',
      'box-shadow',
      'transform',
      'transition',
      'animation',
      'opacity',
      'visibility',
      'cursor',
      'pointer-events',
      'user-select',
    ],
    //endregion
  },
}
