# Шаблон SCSS

`styles/main.scss` — единственная глобальная точка входа для CSS.

`styles/_tools.scss` — Sass-only facade для `additionalData`. Он не должен генерировать реальный CSS.

После настройки сборщика `.module.scss` файлы не должны вручную импортировать общие `functions`, `mixins`, `variables`, `breakpoints` и typography helpers.

## Соглашения по файлам

- Частичные файлы начинаются с `_`.
- Файлы-агрегаторы внутри директорий используют `_index.scss`.
- Стили компонентов следуют паре `ComponentName` и `ComponentName.module.scss`.

## Токены дизайна

Плоская цветовая палитра — это стартовый набор. Его нужно обновить после анализа конкретной дизайн-системы проекта.

Двухуровневые `primitives` / `semantic tokens` автоматически не создаются.

## Layout variables

CSS-переменные layout-слоя — это стартовая база:

- `--padding`
- `--padding-negative`
- `--content`
- `--container`
- `--container-wide`
- `--container-thin`

Короткие модификаторы вроде `._wide` и `._thin` допустимы только вместе с базовым классом.

Поведенческие флаги вроде `.no-padding` и `.desktop-only` остаются отдельными классами.

`container()` поддерживает `$with-padding: false`, поэтому вызывающий код может отключить встроенный padding и задать его явно в селекторе, если это нужно.

`$mobile-360` — это reference width, а не обязательный breakpoint для отдельного layout.

Media utilities доступны глобально.

## Reset, common, typography

`core/_reset.scss` содержит только browser reset rules.
`core/_common.scss` содержит глобальные проектные соглашения и layout helpers.
`core/_typography.scss` содержит глобальные typography classes и tag styles.
`core/_css-variables.scss` содержит layout CSS variables и root-level project placeholders.
`core/_utilities.scss` содержит небольшие глобальные utility-классы, включая текстовые helpers вроде `.italic`, `i`, `em`, `.text-bold`, `.uppercase`, `.underline` и
`.line-through`.
`core/_media-utilities.scss` содержит viewport helper-классы.
`fonts/_index.scss` зарезервирован для реальной загрузки шрифтов через `@font-face` или другой проектный способ.

## Как использовать архитектуру

- Сначала используй существующие mixins, helpers и utility-классы, а не пиши новый ad hoc CSS.
- Для hover-состояний используй `@include hover` и `@include hover-active`, а не дублируй логику hover вручную.
- Для анимируемых свойств используй `@include transition(...)`.
- Для адаптивного поведения предпочитай `min-*` и `desktop-*` media helpers вместо ручных `@media`, если нужный breakpoint уже существует.
- Держи media override рядом с тем селектором, который он меняет.
- Для показа и скрытия элементов на брейкпоинтах сначала используй utility-классы из `core/_media-utilities.scss`.
- Не пиши `display: none` вручную в SCSS, если задачу уже покрывает media utility.
- Не сочетай несколько atomic typography utility-классов на одном элементе.
- Для быстрого применения типографики используй utility-классы из `core/_typography.scss`.
- Для простых текстовых модификаторов используй utility-классы из `core/_utilities.scss`.
- Atomic typography utility-классы берутся из `utils/typography/_atomic.scss`.
- Composite typography rules берутся из `utils/typography/_composite.scss`.
- Если шрифт должен меняться на брейкпоинтах, предпочитай composite-правила типографики.
- Если шрифт не должен меняться на брейкпоинтах, используй atomic-правила типографики.
- Сначала переиспользуй существующие typography presets, и только потом добавляй новый.

## Общие рекомендации по вёрстке

- Для раскладок по одной оси по умолчанию используй `flex`; `grid` оставляй для действительно двумерных сеток, сложного позиционирования или перекрытий.
- Используй `gap` только там, где интервалы между элементами равномерные и задаются как единый внутренний поток.
- Если расстояния между блоками неравномерные или зависят от смысла соседних элементов, используй `margin-top` / `margin-bottom`.

## Точка входа Vite

Глобальный stylesheet подключается один раз в `src/main.tsx`:

```ts
import './shared/styles/main.scss'
```

Sass-only facade подключён для модулей через `additionalData` в `vite.config.ts`:

```ts
additionalData: '@use "@/shared/styles/_tools.scss" as *;',
```

Через `additionalData` нельзя подключать `main.scss`, иначе CSS будет дублироваться при компиляции каждого SCSS Module.
