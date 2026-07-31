# План реализации

## Проект

SPA грузовых аукционов на React, TypeScript, Vite, TanStack Router, TanStack Query, Mantine, SCSS Modules, Orval, Zustand, React Hook Form, Zod и MSW.

## Цель

Локально запускаемое тестовое приложение, соответствующее OpenAPI-контракту и требованиям `SPEC.md`.

## Этапы

1. Уточнить у HR наличие готовых fixtures — внешний вопрос, не блокирует текущий этап.
2. Bootstrap’нуть Vite/React/TypeScript и базовую FSD-структуру — выполнен.
3. Настроить Mantine, SCSS architecture, TanStack Router и providers — выполнен.
4. Настроить Orval и сгенерировать API-типы, клиент и TanStack Query hooks — выполнен.
5. Создать seed-данные или адаптировать fixtures, добавить MSW handlers и in-memory store — не начат.
6. Реализовать список аукционов, URL-фильтры, pagination и prefetch detail — не начат.
7. Реализовать detail-страницу и отдельную страницу `/auctions/:auctionUuid/bet` — не начат.
8. Реализовать историю ставок, mutation ставки, invalidation и toast-сообщения — не начат.
9. Добавить unit-тесты чистой логики и интеграционные тесты MSW handlers — не начат.
10. Подготовить README и `AI_USAGE.md`, проверить в Chrome — не начат.

## Статус этапов

- Этап 1 — ожидает внешнего ответа HR
- Этапы 2–4 — выполнены
- Этап 5 — не начат
- Этапы 6–10 — не начаты

## Следующий этап

Добавить fixtures, MSW-store и handlers для четырёх API endpoint’ов; fixtures уточнить до или во время реализации mock-слоя.
