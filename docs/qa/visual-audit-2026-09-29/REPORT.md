# Візуальний QA вебпрототипу Zapad Banka — 29.09.2026

Переглянуто 13 основних сторінок у Personal і Business на широкому та вузькому екранах: 52 базові стани. Перевірка в локальному in-app browser, вузька ширина 390 px; широкі знімки 1154–1280 px. Додатково оглянуто довгі списки, калькулятори, Analytics і наведені нижче діалоги. Це візуальна перевірка поточних демоданих, не повний функціональний або WCAG-аудит усіх можливих станів.

## Виправлено

- Payments: другорядні дії на вузькому екрані стали компактними рядками; прибрано фіксовану мінімальну висоту плиток. Пошук отримувачів тепер потрапляє в перший екран. Receive / Between accounts використовують спільний Button та однакову типографіку.
- Receive: іконка більше не стискається біля довгого опису; нейтральне оформлення не конкурує з Copy all details.
- Account details: повний IBAN переноситься замість обрізання багатокрапкою.
- Transfer / Bills: прибрано сумування gap і margin під заголовком діалогу.
- Loans: кнопки на вузькій ширині мають однакову ширину.
- Loans / Savings: поля калькуляторів складаються в одну колонку на вузькому екрані; на широкому вирівнюються по нижньому краю.

## Результати спостережень

У 52 базових станах ширина scrollWidth головної області дорівнювала clientWidth; перевірені текстові/інтерактивні елементи не виходили за праву межу. Заголовки сторінок мали 24 px, секцій — 18 px. Профілі зберігають власні primary-кольори. Основні дії доступні, суми та назви в оглянутих деталях читабельні. Перенесення довгих заголовків на 390 px є очікуваним.

Початкові знімки progress bars можуть містити проміжні кадри наявної анімації від нуля; це не трактувалось як неправильне значення прогресу. Знімки `fixed-*` показують перевірені виправлення.

## Покриття основних маршрутів

| Профіль | Екран | Широкий | Вузький |
|---|---|---|---|
| personal | payments | [Знімок](desktop-personal-payments.png) | [Знімок](narrow-personal-payments.png) |
| personal | accounts | [Знімок](desktop-personal-accounts.png) | [Знімок](narrow-personal-accounts.png) |
| personal | cards | [Знімок](desktop-personal-cards.png) | [Знімок](narrow-personal-cards.png) |
| personal | exchange | [Знімок](desktop-personal-exchange.png) | [Знімок](narrow-personal-exchange.png) |
| personal | loans | [Знімок](desktop-personal-loans.png) | [Знімок](narrow-personal-loans.png) |
| personal | savings | [Знімок](desktop-personal-savings.png) | [Знімок](narrow-personal-savings.png) |
| personal | investments | [Знімок](desktop-personal-investments.png) | [Знімок](narrow-personal-investments.png) |
| personal | statements | [Знімок](desktop-personal-statements.png) | [Знімок](narrow-personal-statements.png) |
| personal | transactions | [Знімок](desktop-personal-transactions.png) | [Знімок](narrow-personal-transactions.png) |
| personal | inbox | [Знімок](desktop-personal-inbox.png) | [Знімок](narrow-personal-inbox.png) |
| personal | settings | [Знімок](desktop-personal-settings.png) | [Знімок](narrow-personal-settings.png) |
| personal | help | [Знімок](desktop-personal-help.png) | [Знімок](narrow-personal-help.png) |
| personal | home | [Знімок](desktop-personal-home.png) | [Знімок](narrow-personal-home.png) |
| business | home | [Знімок](desktop-business-home.png) | [Знімок](narrow-business-home.png) |
| business | payments | [Знімок](desktop-business-payments.png) | [Знімок](narrow-business-payments.png) |
| business | accounts | [Знімок](desktop-business-accounts.png) | [Знімок](narrow-business-accounts.png) |
| business | cards | [Знімок](desktop-business-cards.png) | [Знімок](narrow-business-cards.png) |
| business | exchange | [Знімок](desktop-business-exchange.png) | [Знімок](narrow-business-exchange.png) |
| business | loans | [Знімок](desktop-business-loans.png) | [Знімок](narrow-business-loans.png) |
| business | savings | [Знімок](desktop-business-savings.png) | [Знімок](narrow-business-savings.png) |
| business | investments | [Знімок](desktop-business-investments.png) | [Знімок](narrow-business-investments.png) |
| business | statements | [Знімок](desktop-business-statements.png) | [Знімок](narrow-business-statements.png) |
| business | transactions | [Знімок](desktop-business-transactions.png) | [Знімок](narrow-business-transactions.png) |
| business | inbox | [Знімок](desktop-business-inbox.png) | [Знімок](narrow-business-inbox.png) |
| business | settings | [Знімок](desktop-business-settings.png) | [Знімок](narrow-business-settings.png) |
| business | help | [Знімок](desktop-business-help.png) | [Знімок](narrow-business-help.png) |

## Додаткові стани

- Send money: вибір отримувача; New recipient: порожня форма IBAN; Between accounts: вибір рахунків.
- Upcoming bills: список сум, рахунок списання, підсумок.
- Receive money: вибір рахунку, реквізити, Copy all details.
- Account details: сума, IBAN, дії та останні операції.
- Card: Freeze confirmation, Spending limits, закритий стан Card details (без розкриття реквізитів).
- Savings goal: деталі Holiday goal.
- Нижні блоки: Analytics, списки Accounts / Activity / Inbox, Demo workspace, Help, калькулятори, allocation і reference rates.

## Межі

Не перевірялись усі комбінації помилок, порожніх/довгих даних, завершення фінансових флоу, реальні пристрої та інші браузери. Фінансові дії та налаштування у ході цього QA не підтверджувались. Мобільний застосунок не змінювався. Автоматичні вимірювання збережені в [measurements.json](measurements.json).

## Перевірки коду

`npm run lint:design-system`, `npm run test:design-system`, `npm run check:ui-registry`, `npm run build --prefix artifacts/zapad-webapp`.

## 2026-09-30 — 320px reflow follow-up

DOM geometry checked all13 primary routes × Personal/Business at320×800. All26 main regions had clientWidth=scrollWidth=320; sampled controls/headings/amount containers stayed within viewport. `reflow-320.json` records route headings and bounds. A second scan of text-bearing elements found truncated Home merchant names/metadata and a Business100.0% label overflowing its fixed width. Recent activity now stacks the amount/category below the description when its container is narrow and wraps names/metadata; desktop keeps side-by-side amounts. Analytics percentage slot increased fromw-9 tow-12. Repeat Home scan finds no overflowing text-bearing elements in either profile (`reflow-320-fixed.json`). Business Cards and Home activity visually inspected; desktop Home confirmed after changes.

Receive and Between accounts dialogs checked at320px (`dialog-reflow-320.json`); their shells and controls fit. Visual inspection caught a clipped balance inside Transfer's source selector despite fitting outer bounds. The selected control now shows account name/currency with the full available balance in a separate line; screenshot `transfer-balance-320.png` verifies €28,430.18 without truncation. `home-activity-320.png` shows complete merchant names and readable amounts. These measurements and selected visual checks do not claim all possible dialog states, screen-reader conformance, or actual200% browser zoom.
