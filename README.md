# cargo-auctions

SPA для работы с грузовыми аукционами. Требования и API-контракт описаны в
[`SPEC.md`](./SPEC.md) и [`openapi.auctions.v0.json`](./openapi.auctions.v0.json).

## Запуск

```bash
npm install
npm run dev
```

Проверки и генерация API-кода:

```bash
npm run typecheck
npm run build
npm run generate:api
```

## Архитектура

- React + TypeScript + Vite.
- FSD-слои находятся в `src/app`, `src/pages`, `src/widgets`, `src/features`, `src/entities` и `src/shared`.
- Mantine используется для базовых UI-компонентов, собственные стили — SCSS Modules.
- TanStack Router отвечает за маршрутизацию, TanStack Query — за серверное состояние.
- Zustand зарезервирован для точечного UI-state.
- Типы, fetch-клиент и TanStack Query hooks генерируются Orval в `src/shared/api/generated`.
