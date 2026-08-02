# Рабочие заметки проекта

## Проект

SPA для работы с грузовыми аукционами по OpenAPI-схеме `openapi.auctions.v0.json`.

## Цель

Локально запускаемое React-приложение со списком аукционов, detail-страницей, отдельной страницей ставки и историей ставок.

## Текущее состояние

Есть тестовое задание в PDF, OpenAPI JSON-схема, `SPEC.md`, `NOTES.md` и `PLAN.md`. Bootstrap и базовый mock-слой готовы. Моковые данные сгенерированы по OpenAPI-спеке.

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
- Формы: общие поля, маски, телефонная логика и Zod error map находятся в `src/shared/forms`; схемы конкретных фич — в `src/features/*/model/schemas.ts`.
- Моки: MSW с in-memory store; состояние сбрасывается после перезагрузки.
- Авторизация: не реализуется, используется фиксированный mock-пользователь.
- UI-тесты не обязательны; планируются unit-тесты чистой логики и интеграционные тесты MSW handlers.

## Что уже сделано

- Проанализирован PDF и OpenAPI-контракт.
- Создан `SPEC.md` с требованиями, решениями и открытыми вопросами.
- Моковые данные сгенерированы по OpenAPI-спеке и покрывают необходимые сценарии.
- Выполнен bootstrap React/Vite/TypeScript, базовые providers, SCSS Modules, Zustand, FSD-каталоги и Orval-generated API-код.
- Добавлены seed-данные для пяти сценариев, in-memory MSW-store, handlers четырёх API endpoint’ов и browser worker для dev-режима.
- Добавлена dev-only smoke-проверка mock API с assertions по основным ответам и поддержкой фильтрации списка по ключевым параметрам контракта.

## Текущие проблемы / открытые вопросы

- Текущие seed-данные покрывают пагинацию, скрытую историю ставок, недоступную ставку, победившие и отменённые ставки, пустые контакты и перевозчика, длинный маршрут, несколько машин и `null`-значения.
- Этап списка аукционов завершён: добавлены URL-фильтры через Zod, карточки, loading/empty/error, пагинация, prefetch detail и route-заглушка detail.
- После review подключён `@mantine/dates`, URL search сохраняет неизвестные параметры, а mock-фильтрация дат сравнивает timestamps.
- После дополнительного review версии Mantine закреплены на `9.5.0`, многозначные URL-фильтры сохраняются при применении формы, а dropdown-анимация не обрезает тень.
- Detail-страница расширена: данные загружаются через `useAuctionDetailQuery`, добавлены секции основных данных, маршрута, груза, организатора, оплаты и параметров торгов.
- На detail обработаны `can_set_bet`, `hide_bets_history`, `no_view_cargo_price`, а также скрытие адресов и контактов маршрутных точек.
- История ставок подключена к detail через отдельный query с `all=true`: отображаются цены с НДС и без НДС, перевозчик, место, победитель и причина отмены; предусмотрены скрытое, loading, error и empty-состояния.
- После review detail показывает доступную цену, требования к ТС и свою ставку; цена груза скрывается отдельно от торговых цен.
- Страница `/auctions/:auctionUuid/bet` загружает detail, проверяет `can_set_bet` и валидирует цену через React Hook Form + Zod с учётом `min/max/step`; feature-hook отправляет `POST /auctions/:auctionUuid/bets` и инвалидирует detail/list, страница показывает success/error notifications.
- Для Zod 4 подключена русская глобальная карта ошибок с возможностью локально переопределять сообщения на уровне схем.
- Добавлена typed-модальная инфраструктура на Zustand в `src/app/modals`: registry, actions, host и состояния с корректным завершением exit-анимации Mantine.
- Демо-кнопки модалок размещены под header; inline-фильтры вынесены в `features/auction-filters`, а на mobile открываются в правом Drawer.
- В modal host модалки постоянно присутствуют в закрытом состоянии для корректной enter-анимации; при открытии принудительно блокируется scroll `html/body` и скрывается scrollbar.
- При блокировке scroll modal host компенсирует ширину исчезнувшего scrollbar через CSS-переменную `--modal-scrollbar-width` и `body.padding-right`, предотвращая layout shift.
- Для sticky header высота `AppShell.Main` ограничена `calc(100dvh - header-height)`, чтобы header не добавлял лишний viewport к минимальной высоте страницы.
- Demo Drawer слева и справа на mobile получают ширину `100vw` через registry-флаг и переопределение корневой переменной Mantine `--drawer-size`.
- Для защиты от устаревшего callback exit-анимации modal store использует `closeSequence`; старый callback не удаляет повторно открытую модалку.
- Удалён неиспользуемый старый `shared/store/ui.store.ts`; `getModalParams` и `closeAllModals` сохранены как заготовки публичного modal API.
- Добавлены unit-тесты преобразования фильтров и схемы ставки, а также интеграционные тесты MSW handlers для списка, detail, истории ставок и POST ставки; запуск выполняется через `npm test`.
- После review MSW history handler учитывает `all=true`, а интеграционные тесты сбрасывают in-memory store перед каждым сценарием.

## Следующий шаг

Следующий этап — подготовить `AI_USAGE.md`, актуализировать README и выполнить ручную проверку в Chrome.

Текущие подшаги этапов 7–9 завершены: detail-заглушка заменена полноценной страницей, route ставки получил рабочую форму и mutation, история ставок подключена к detail и инвалидируется после успешной ставки, unit/integration-тесты добавлены.
