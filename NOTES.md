# Рабочие заметки проекта

## Проект

SPA для работы с грузовыми аукционами по OpenAPI-схеме `openapi.auctions.v0.json`.

## Цель

Локально запускаемое React-приложение со списком аукционов, detail-страницей, отдельной страницей ставки и историей ставок.

## Текущее состояние

Есть тестовое задание в PDF, OpenAPI JSON-схема, `SPEC.md`, `NOTES.md` и `PLAN.md`. Проект пока не bootstrap’нут. Готовые mock fixtures от HR не получены.

## Ключевые решения

Только действительно важные архитектурные договорённости.

- UI-kit: Mantine.
- Собственные стили и layout: SCSS Modules; глобальные variables/mixins/functions подключаются через Vite/Sass architecture.
- API-типы, клиент и TanStack Query hooks: Orval из OpenAPI JSON.
- Для `POST /auctions/list`, который Orval генерирует как mutation, используется ручной TanStack Query wrapper с query key по параметрам списка.
- Роутинг: TanStack Router.
- Серверное состояние: TanStack Query.
- Клиентский UI-state: Zustand.
- Состояние формы: React Hook Form + Zod.
- Фильтры: URL search params с Zod-валидацией.
- Установка ставки: отдельный route `/auctions/:auctionUuid/bet`.
- Моки: MSW с in-memory store; состояние сбрасывается после перезагрузки.
- Авторизация: не реализуется, используется фиксированный mock-пользователь.
- UI-тесты не обязательны; планируются unit-тесты чистой логики и интеграционные тесты MSW handlers.

## Что уже сделано

- Проанализирован PDF и OpenAPI-контракт.
- Создан `SPEC.md` с требованиями, решениями и открытыми вопросами.
- Зафиксировано, что готовые fixtures от HR пока не получены.
- Выполнен bootstrap React/Vite/TypeScript, базовые providers, SCSS Modules, Zustand, FSD-каталоги и Orval-generated API-код.

## Текущие проблемы / открытые вопросы

- Ответ HR о fixtures остаётся внешним открытым вопросом и не блокирует bootstrap.
- Если fixtures не будет, нужно создать seed-данные с edge cases самостоятельно.

## Следующий шаг

Добавить fixtures, MSW-store и handlers для четырёх API endpoint’ов; fixtures уточнить до или во время реализации mock-слоя.
