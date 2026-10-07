# ZapadBanka — guidelines для разработки

## Продукт

Это **банковское веб-приложение необанка** (digital / internet banking), а не generic fintech landing или admin panel.

- Ориентир по UX: Wise, Revolut, N26, Monzo.
- Два профиля: **personal** и **business** — разные mock-данные, темы (brand-personal / brand-business), сценарии.
- Пользователь за 5–10 секунд на Dashboard должен видеть: баланс primary-счёта, динамику, быстрые действия, счета, последние операции.

Спецификация: `src/imports/zapad_banka_neobank_ux_specification.md`.

---

## Деньги в UI

- Всегда использовать `src/app/utils/format.ts`: `formatMoney`, `formatMoneyParts`, `formatMoneyCompact`, `formatNumber`.
- Locale: **en-US** (запятые в тысячах).
- Hero-баланс: `formatMoneyParts` + отдельно символ валюты; целая часть и копейки в **одной** `inline-flex whitespace-nowrap` группе.
- Не хардкодить суммы вида `€28430` в новых компонентах.

---

## Dashboard и счета

- **BalanceHero** — только **primary account** (`getPrimaryAccount`), не сумма всех счетов.
- **AccountsStrip** — все счета; клик → деталь / accounts.
- Не показывать в hero смешанный EUR+USD без подписи.
- Подписи счетов: имя + `ibanShort` (например `Main account · ME25 ··· 3001`).

---

## Навигация и маршруты

- Базовый путь: `profilePath(profileSlug, segment)` из `src/app/utils/paths.ts`.
- `PAGE_MAX_WIDTH = max-w-[1200px]` на всех основных страницах.
- Sidebar groups: Money → Products → Services; Settings / Help внизу.
- При добавлении deep link — реально читать `useParams` / `useSearchParams`, не только объявлять route.

---

## Вёрстка и Safari

- Карточки: не вешать на базовый `Card` лишний `flex gap-6` без нужды.
- Hover scale только через утилиты в `src/styles/safari-fixes.css` (`zb-hover-scale-*`) — `@media (hover: hover) and (pointer: fine)`.
- Избегать `items-baseline` на крупных суммах с разными размерами шрифта; предпочитать `items-end` и группировку цифр.
- `data-slot="card"` + `min-w-0` для flex overflow в WebKit.

---

## Данные

- Централизованный слой: `src/app/data/` — предпочитать его вместо новых inline mock на страницах.
- Primary: `p-main` (personal), `b-operating` (business).
- Не добавлять секреты, `.env` с ключами в репозиторий.

---

## Тон и копирайт

- Ясные банковские формулировки: Available balance, Operating account, Pending, Statement.
- «Coming soon» не использовать для основных CTA — вести на реальный route или явный прототип-dialog.
- Business vs Personal — различать в подписях (Business badge, Operating vs Main).

---

## Что не делать

- Не превращать прототип в production banking без auth, RLS, audit, PCI scope.
- Не ломать profile switch и `sanitizePathForProfile`.
- Не дублировать три dev-сервера на разных портах при QA — один `npm run dev` на **5173**.
