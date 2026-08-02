# План реализации

## Проект

SPA грузовых аукционов на React, TypeScript, Vite, TanStack Router, TanStack Query, Mantine, SCSS Modules, Orval, Zustand, React Hook Form, Zod и MSW.

## Цель

Локально запускаемое тестовое приложение, соответствующее OpenAPI-контракту и требованиям `SPEC.md`.

## Этапы

1. Сгенерировать моковые данные по OpenAPI-спеке и зафиксировать сценарии — выполнен.
2. Bootstrap’нуть Vite/React/TypeScript и базовую FSD-структуру — выполнен.
3. Настроить Mantine, SCSS architecture, TanStack Router и providers — выполнен.
4. Настроить Orval и сгенерировать API-типы, клиент и TanStack Query hooks — выполнен.
5. Создать seed-данные по OpenAPI-спеке, добавить MSW handlers и in-memory store — выполнен.
6. Реализовать список аукционов, URL-фильтры, pagination и prefetch detail — выполнен.
7. Реализовать detail-страницу и отдельную страницу `/auctions/:auctionUuid/bet` — выполнен.
8. Реализовать историю ставок, mutation ставки, invalidation и toast-сообщения — выполнен.
9. Добавить unit-тесты чистой логики и интеграционные тесты MSW handlers — выполнен.
10. Добавить модальную инфраструктуру Zustand/Mantine и мобильный Drawer фильтров — выполнен.
11. Подготовить README и `AI_USAGE.md`, проверить в Chrome — не начат.

## Статус этапов

- Этап 1 — выполнен
- Этапы 2–4 — выполнены
- Этап 5 — выполнен
- Этап 6 — выполнен
- Этап 7 — выполнен
- Этап 8 — выполнен
- Этап 9 — выполнен
- Этап 10 — выполнен
- Этап 11 — не начат

## Следующий этап

Подготовить `AI_USAGE.md`, актуализировать README и выполнить ручную проверку в Chrome.

## Результат этапа 6

- Список загружается через `useAuctionsListQuery`.
- Фильтры и страница восстанавливаются из URL и безопасно валидируются через Zod.
- Есть loading, empty, error и pagination-состояния.
- Карточка ведёт на `/auctions/:auctionUuid`, а detail prefetch выполняется при наведении/focus.
