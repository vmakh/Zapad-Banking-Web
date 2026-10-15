# Zapad Banka — дизайн-система та UI-компоненти

Актуалізовано: **14 жовтня 2026** за поточними файлами робочої копії, включно з незакоміченими змінами. Документ описує реалізацію фронтенд-демо. Перекази, погодження, рахунки, авторизація та ринкові показники не є реальними банківськими операціями.

Візуальний контракт: [DESIGN.md](../DESIGN.md). Повний каталог експортів, їхніх props та прямих імпортів: [UI_COMPONENTS.md](UI_COMPONENTS.md). Каталог генерується автоматично; цей документ пояснює, як його застосовувати.

## 1. Джерела та порядок стилів

Застосунок використовує React 18, TypeScript, Vite та Tailwind CSS 4. Спільні UI-примітиви розміщені в `src/app/components/ui/`, банківські композиції — у `src/app/components/zapad/`. Багато інтерактивних примітивів побудовано на Radix UI; іконки — Phosphor 2.1.10, графіки — Recharts, повідомлення — Sonner.

| Джерело | Відповідальність |
| --- | --- |
| [src/main.tsx](../src/main.tsx) | Підключення головного `styles/index.css` |
| [styles/tailwind.css](../src/styles/tailwind.css) | Tailwind 4, сканування `src`, `tw-animate-css` |
| [styles/theme.css](../src/styles/theme.css) | Семантичні кольори, базова типографіка, активні `--bank-*` токени Personal/Business |
| [styles/design-system.css](../src/styles/design-system.css) | Іменовані розміри, тіні, сітки, transition та viewport utilities |
| [styles/index.css](../src/styles/index.css) | Компонентні стилі, адаптивність і фінальні перевизначення банківського UI |
| [styles/safari-fixes.css](../src/styles/safari-fixes.css) | Сумісність із Safari |
| [components/ui/utils.ts](../src/app/components/ui/utils.ts) | `cn()` для об'єднання умовних класів і розв'язання конфліктів Tailwind |

`index.css` імпортує `fonts.css` → `tailwind.css` → `theme.css` → `design-system.css` → `safari-fixes.css`, після чого визначає власні правила. Ефективний вигляд залежить від каскаду та специфічності. Початкові сині/фіолетові стилі у верхній частині файлів не є остаточною палітрою: нижні блоки `Mobile visual foundation` і `Action hierarchy` змінюють їх.

`RootLayout` встановлює `.bank-workspace[data-bank-profile="personal|business"]`. Селектор `:root:has(.bank-workspace[data-bank-profile="business"])` перемикає токени на корені документа, тому Radix-портали також отримують поточну палітру. Не обмежувати тему лише вкладеним контейнером.

## 2. Колірні токени

Наведені нижче значення — фінальні токени світлого банківського workspace з `theme.css`.

| Токен | Personal | Business | Роль |
| --- | --- | --- | --- |
| `--bank-ink` | `#172337` | `#202832` | Основний текст |
| `--bank-muted` | `#58677b` | `#596573` | Допоміжний текст |
| `--bank-line` | `#e6ebf2` | `#e4e7ea` | Тихі роздільники панелей |
| `--bank-control-line` | `#7b8798` | `#7c8289` | Видимі межі полів |
| `--bank-choice-line` | `#7a8ba0` | `#8a8176` | Межі checkbox, radio та вимкненого switch |
| `--bank-positive-ink` | `#14632b` | `#14632b` | Позитивні суми та успішні індикатори |
| `--bank-paper` | `#f4f7fb` | `#f3f4f5` | Фон main, нейтральні поверхні |
| `--brand-personal` / `--brand-business` | `#0034B8` | `#A34900` | Єдині базові кольори профілів |
| `--bank-soft` | `#f0f5fd` | `#fff3e9` | М'який акцент, вибір профілю |
| `--bank-accent` | `var(--brand-personal)` | `var(--brand-business)` | Заливка, межі та focus |
| `--bank-accent-text` | `var(--brand-personal)` | `var(--brand-business-text)` | Контрастний акцентний текст |
| `--bank-action` | `var(--bank-accent)` | `var(--bank-accent)` | Основна дія; спільний колір профілю |
| `--bank-action-ink` | `var(--brand-personal-foreground)` = білий | `#ffffff` = білий | Текст основної дії |
| `--bank-wash` | `linear-gradient(115deg, var(--card), var(--bank-soft))` | Та сама формула з Business-токенами | Поверхня огляду балансу |

Використовувати семантичні Tailwind-класи: `bg-background`, `bg-card`, `bg-muted`, `bg-accent`, `text-foreground`, `text-muted-foreground`, `text-accent-foreground`, `text-primary-text`, `text-primary-foreground`, `border-border`, `ring-ring`. Вони зв'язані з CSS-змінними через `@theme inline`. Для тексту на акцентній заливці — `text-primary-foreground`, для посилання на світлій поверхні — `text-primary-text`.

Похідні відтінки генеруються через `color-mix`, а не зберігаються незалежними hex: Personal mid/light/dark — 95%/85%/92% основного кольору (mid/light із білим, dark із чорним); Business — 95%/85%/96%. `--brand-business-text` — 88% Business із чорним. Білий на `#A34900` має контраст 5.98:1. Business-аватари й основні кнопки використовують цей спільний колір та білий текст (`--brand-business-foreground`, `--bank-action-ink`). Дрібні акцентні написи мають темніший похідний відтінок. Personal-аватар завжди з білим текстом, зокрема в меню Business-профілю.

`--background`, `--card`, `--popover` — білі поверхні. `--primary` посилається на `--bank-action`, `--border` — на `--bank-line`, `--ring` — на `--bank-accent`. Поле використовує `--bank-field`: Personal `#f5f7fa`, Business `#f3f4f5`. Колір destructive-дії — `--destructive: #b3261e`, помилки поля — `--bank-error: #b42318`; `aria-invalid="true"` зберігає error-межу навіть у порталах.

У файлі є базові `.dark` токени, але поточний банківський UI та Toaster налаштовані на світлий вигляд. Наявність `.dark` не означає готову окрему темну тему. `--brand-*-mid/light/dark` — похідні матеріали; активний профіль визначається через `--bank-*` контракти.

## 3. Типографіка

| Стиль | Шрифт / вага | Розмір | Line height | Відступ після | Tracking |
| --- | --- | --- | --- | --- | --- |
| h1 | Unbounded 500 | 40 px | 48 px | 24 px | -.025em |
| h2 | Unbounded 500 | 32 px | 40 px | 20 px | -.020em |
| h3 | Unbounded 500 | 28 px | 36 px | 16 px | -.015em |
| h4 | Unbounded 500 | 24 px | 32 px | 16 px | -.010em |
| h5 | Unbounded 500 | 20 px | 28 px | 12 px | -.005em |
| h6 | Unbounded 500 | 16 px | 24 px | 8 px | 0em |
| paragraph-sm | Onest 400 | 12 px | 20 px | 8 px | 0em |
| paragraph-md | Onest 400 | 16 px | 24 px | 12 px | 0em |
| paragraph-lg | Onest 400 | 20 px | 28 px | 16 px | -.005em |

Погоджена 15.10.2026 шкала однакова для Personal та Business. Канонічні токени `--text-h1`…`--text-h6`, `--text-paragraph-sm/md/lg` та `--spacing-*-after` знаходяться в `design-system.css`. Розмір, line height та відступи кратні 4 px; tracking — оптичний, у em. Radix Dialog/Sheet/AlertDialog titles рендерять h2 та отримують 32/40. Заголовки не зменшуються на мобільних; довгі слова можуть переноситися. Поля й кнопки використовують 16/24; labels 500, суми 600, дії 650. `text-sm` і `text-xs` позначають підтримувальний текст 12/20; основні описи — `text-base` 16/24, розширені — `text-lg` 20/28.

Відступ після абзацу застосовується між послідовними абзацами, не додається поверх gap у компонентах. Відступ після заголовка задає його роль; останній заголовок у рядку/групі не створює зайвого відступу. Onest і Unbounded завантажуються локально з `src/assets`, ліцензії збережено поруч. Числа та валюта залишаються разом; основний баланс зберігає окреме масштабування за шириною контейнера до 48 px і tabular-nums.

## 4. Геометрія та композиція

Форма обміну: сума списання, розрахована сума та селектори валют мають висоту 48 px, внутрішні відступи 12 px по горизонталі / 8 px по вертикалі, Onest 16 px і спільний радіус контролю 12 px. Розрахована сума використовує shared Input із readOnly. Вузькі контейнери складають суму й валюту вертикально; від `@sm` вони стоять в одному рядку, селектор має ширину 144 px. Групи мають padding 16 px, проміжок між контролами 12 px, допоміжний текст відділено на 8 px. Основна дія використовує Button size="lg". Ті самі токени геометрії застосовуються до всіх Input, селекторів і стандартних кнопок Personal та Business, включно з портальними попапами. 48 px — мінімум: селектори та кнопки ростуть за довгим текстом, Textarea має мінімум 96 px. Компактні, квадратні icon-кнопки й спеціальні розміри залишаються окремими ролями. У формах переказу й продуктів між групами 24 px, у footer — такий самий padding 24 px, як у тіла форми.

Планшетна та десктопна перевірка Onest: верхня панель показує компактну кнопку пошуку до breakpoint `xl` (1280 px), а повну кнопку з текстом — від `xl`, коли є достатньо ширини поряд із профілем і службовими діями. Обидва варіанти відкривають той самий пошук. [Звіт для ширин 768–1440 px](qa/onest-wide-2026-10-15/REPORT.md).

Мобільна перевірка Onest (15.10.2026): текстові `Button` обмежені шириною батьківського блоку, можуть стискатися та переносити довгі слова; на мобільних їхня висота визначається вмістом. Квадратний `size="icon"` зберігає геометрію. Кнопки footer переказу на мобільних стоять вертикально. У картках рахунків дії складаються в одну колонку, а в цілях дозволено перенесення групи дій. Сума в деталях операції використовує той самий принцип масштабування за шириною контейнера, що й головний баланс. Таблиця cash flow має власне доступне з клавіатури горизонтальне прокручування. [Матриця перевірки та докази](qa/onest-mobile-2026-10-15/REPORT.md).

- Форма: `--bank-control-radius: 0.75rem` (12 px); панель: `--bank-panel-radius: 1rem` (16 px).
- Базовий `--radius: 1.25rem` (20 px) і похідні `rounded-*` не описують усі фактичні радіуси: банківські CSS-правила перевизначають Card і controls. Transfer Dialog має окремий радіус 24 px.
- Стандартна шкала відступів Tailwind: `gap-2` 8 px, `gap-3` 12 px, `gap-4` 16 px, `gap-6` 24 px, `gap-8` 32 px. Між заголовком секції та вмістом — 8–16 px; між незалежними секціями — 24–32 px. Враховувати padding рядків у видимому проміжку.
- Білі панелі та навігація, світлий плоский canvas, тихі межі. Основні Card у workspace не мають тіні.
- Не додавати довільні Tailwind-значення, дублікати примітивів, рекламні hero, glow, sparkle або декоративне збільшення карток при hover.

| Utility | Контракт |
| --- | --- |
| `grid-cols-dashboard` | `minmax(0, 1fr) minmax(280px, 340px)` |
| `grid-cols-product-detail` | `1fr 380px` |
| `grid-cols-transaction-detail` | `1fr 320px` |
| `grid-cols-payment` | `1.15fr 1fr` |
| `max-w-dialog-inset` | `calc(100% - 2rem)` |
| `max-w-dialog-viewport` | `85vw` |
| `max-h-dialog` | `85dvh` |
| `max-h-sheet` / `max-h-drawer` | `70vh` / `80vh` |

Сітки застосовуються з адаптивними префіксами, а не примусово на мобільних. Dashboard переходить від однієї колонки до `lg:grid-cols-dashboard`. Спільні компоненти поєднують Tailwind breakpoints із CSS-правилами `max-width:600px`; єдиного breakpoint для всього UI немає. Поточна геометрія Dialog може перевизначатися класами конкретного сценарію, наприклад `.bank-transfer-dialog`.

## 5. Ієрархія дій і стани

На сторінці або активному кроці діалогу — щонайбільше одна залита основна дія. Інформаційна сторінка може не мати її. Діалог є окремою робочою поверхнею. На Loans основна дія — Apply for loan, на Savings — New goal, на Payments — Transfer. Повторювані дії рядків — outline/ghost; важлива другорядна дія може мати м'яку акцентну поверхню.

Колір потрібен для основної дії, профілю, фінансового напрямку та стану. Звичайні метрики, калькулятори, notification counts та progress залишаються нейтральними. Аватар профілю є винятком: Personal синій `#0034B8`, Business помаранчевий `#A34900`; поточний профіль також має checkmark і м'яку акцентну поверхню.

Не змінювати `data-slot` і `data-variant` випадково: це селектори спільних стилів. Стан selected має бути доступним через семантику відповідного примітива, а не лише через колір. Disabled та invalid передаються в API контролу, помилки прив'язуються через `aria-describedby`.

## 6. Практичні контракти UI-примітивів

Імпорт: `@/app/components/ui/<module>`. Повний успадкований API і посилання на реалізацію — у [реєстрі](UI_COMPONENTS.md).

| Компонент | Як використовувати |
| --- | --- |
| `Button` | `variant`: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`. Типово `default`. `size`: `default` (мінімум 48 px), `sm` (мінімум 40), `lg` (мінімум 48), `xl` (мінімум 52), `2xl` (мінімум 56), `icon` (44). `data-size` передає обраний розмір; текстові кнопки ростуть за вмістом при переносі. Класи споживача можуть змінювати геометрію. `asChild` для посилання, `ref` передається елементу; icon-only кнопка потребує доступної назви |
| `Card` | `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`; повторно використовувати контейнер, а не створювати іншу систему панелей |
| `Input`, `Textarea`, `Label` | Явний label/id; `aria-invalid`, пояснення помилки; читабельна control-межа. `Label` імпортується з `label` |
| `Select` | `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`; підтримувати зрозумілу назву та значення. Вибране значення переноситься без line-clamp; висота trigger визначається вмістом із мінімумом для обраного size, щоб зберігати повні суми. Складний пошук рахунків — наявна композиція `Popover` + `Command` у ReceiveSheet |
| `Dialog` | `open`, `onOpenChange`; Content, Header, Title, Description, Footer. Портал, overlay та dismiss уже реалізовані. `useReturnFocus` обробляє відновлення фокусу; сценарій може передати власні autofocus handlers |
| `AlertDialog` | Підтвердження дії. Action і Cancel мають `data-slot="button"` та `data-variant="default|outline"`, тому отримують ті самі профільні кольори, що й кнопки на сторінці, у Dialog та Sheet |
| `Sheet` | Для деталей і мобільної навігації. `SheetContent.side`: `top`, `right`, `bottom`, `left`; типово `right`. Додати Title та Description, за потреби візуально приховані |
| `DropdownMenu` | Меню профілю й дій; використовувати готові Item/RadioItem/CheckboxItem та Trigger, зберігаючи клавіатурну поведінку Radix |
| `Collapsible` | Розкриття історії чи допоміжного вмісту; не модальне завдання |
| `Progress` | `value` через Radix Root; поточне значення видно одразу, fill нейтральний. Додати `aria-label` або `aria-labelledby`; не запускати відомий відсоток від нуля |
| `Avatar`, `Badge`, `Separator` | Ідентичність, короткий стан, розділення; не перетворювати supporting surfaces на нові primary actions |
| `Switch`, `Checkbox`, `Slider` | Перемикачі та числові налаштування; назва, поточний стан і клавіатурне керування обов'язкові |
| `ChartContainer`, `ChartTooltipContent` | Обгортки Recharts доступні в бібліотеці; фактичні імпорти див. у реєстрі. Дані демо, із текстовим контекстом значень |

`App.tsx` монтує спільний `Toaster` із `ui/sonner.tsx`: `theme="light"`, `position="top-right"`, `richColors`, `closeButton`. Обгортка задає Phosphor-іконки success/info/warning/error/loading/close і спільні токени поверхні.

```tsx
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";

// t() — із useI18n() у компоненті.
<Button type="button" variant="outline" className={cn("gap-2", compact && "w-full")}>
  {t("View details")}
</Button>
```

## 7. Банківські компоненти

Імпорт: `@/app/components/zapad/<Module>`. Таблиця описує призначення, а не гарантує монтування кожного експорту на поточних маршрутах. Прямі місця імпорту та точні props генеруються в реєстрі.

| Компоненти | Призначення / контракт |
| --- | --- |
| `Sidebar`, `SidebarContent`, `TopBar`, `LanguageSwitcher` | Навігація, мобільне меню, профіль, пошук, приватність та мова; `LanguageSwitcher.compact` — компактна кнопка з коротким позначенням обраної мови; доступний підпис і tooltip містять повну назву |
| `BalanceHero`, `AccountsStrip` | Баланс активного рахунку, зміна рахунку, переходи. Ідентичність рахунку має залишатися поруч із сумою |
| `Transactions`, `TransactionDetailsSheet`, `TransactionExtras` | Операції, деталі, нотатки й експорт; зберігати контекст профілю/рахунку та privacy masking |
| `ExpenseAnalytics` | Аналітика витрат із переходом до операцій; не позначати демонстраційні дані як live |
| `SavingsGoals`, `GoalDialog` | Огляд і редагування цілей; спільний Progress, доступні labels, валідація сум |
| `RightPanel`, `AlertsCard`, `CardWidget` | Композиції віджетів; Dashboard наразі імпортує `AlertsCard` і `CardWidget` окремо |
| `PaymentCard` | `name`, `last4`, `expiry`; опційні `holder`, `isPrivate=false`, `frozen=false`. Тип/мережа визначаються з `name`: Business/Virtual, Visa-prefix. Перекладається відображення, а не значення-ідентифікатор |
| `CurrencyFlag`, `CurrencyMark` | Експорти з `CurrencyIcon`: прапорець 28 px, символьна поверхня 44 px. Прапорці EUR/USD/GBP беруться з локальних SVG |
| `TransferModal`, `ReceiveSheet`, `ExchangeModal` | Переказ-preview, реквізити отримання, перехід до сценарію обміну; не підтверджують реального settlement |
| `ProductPreviewDialog`, `PreviewHistory` | Локальні попередні перегляди продуктів, історія та демонстраційні погодження; зберігати пояснення обмежень демо |
| `DashboardPaymentsCta`, `QuickActions` | Наявні композиції швидких дій; перевіряти актуальні імпорти перед повторним використанням |
| `IconScaleSlot` | Стабільна обгортка іконки: `children`, `className`, `innerClassName`, `innerStyle`; сама обгортка не додає анімацію |

Артворк PaymentCard — дозволений виняток із нейтральних поверхонь: `aspect-ratio:1.586`, `max-w-sm`, 16 px radius, білий знак банку, NFC, маскований номер та Visa/Mastercard. Personal використовує `--bank-card-base: #153d79`, glow `#3266a3`, end `#122944`; Business — copper base `#263240`, glow `#996c50`. Virtual має окремі Personal та Business токени. Frozen зменшує saturation; приватність приховує номер, ім'я і строк дії. Не переносити ці градієнти на звичайні інформаційні панелі.

## 8. Доступність, рух і локалізація

- `RootLayout` має skip-link, main із `tabIndex={-1}`, керування фокусом при переходах та мобільний Sheet. Зберігати цей контракт при зміні маршрутизації.
- Focus-visible у workspace/Dialog/Sheet: outline 2 px із `--ring`, offset 2 px. Не прибирати його разом із тінями.
- Закриття Dialog має зону 44×44 px; Sheet — кнопку `size-11`; Switch розширює touch target псевдоелементом. `Button size="icon"` типово має 44 px; класи споживача можуть змінювати розмір.
- Пошук відкривається після активації, а не лише focus. Повернення фокусу має вести до доступного trigger або логічного наступного елемента.
- `prefers-reduced-motion: reduce` у фінальному CSS вимикає transitions, animations та smooth scrolling, включно з портальними елементами. Для контрольованого руху вже існують `transition-control`, `transition-field`, `transition-surface` та інші іменовані utilities.
- Текст UI — через `useI18n().t()`, числа/суми/дати — через спільні [format.ts](../src/app/utils/format.ts) і [date.ts](../src/app/utils/date.ts). Поточний вибір містить 13 мовних/писемних варіантів; деталі — [LOCALIZATION.md](LOCALIZATION.md).
- Перевіряти довгі переклади, суми й назви на вузькому екрані; не обрізати ставки та суми заради рядка метрик. Нові рядки додавати в каталоги локалізації. Зберігати зміст попереджень про демо в кожній мові.

## 9. Підтримка документації

Перед зміною UI читати `DESIGN.md` і `docs/UI_COMPONENTS.md`. Повторно використовувати примітиви та токени; умовні класи збирати через `cn()`. Tailwind 4; не послаблювати lint.

Після зміни експорту, props або місць імпорту компонентів виконати `npm run generate:ui-registry`. Генератор відновить каталог і карту прямих імпортів із коду. Після зміни токенів/правил оновити цей документ і, якщо змінився візуальний контракт, `DESIGN.md`.

Перед завершенням виконати `npm run check`: ESLint без warnings → TypeScript → tests → перевірка актуальності реєстру → production build. Для UI-змін додатково перевірити Personal/Business, широкий/вузький екран, клавіатуру, портали та reduced motion.

## 10. Узгодження з мобільним проєктом — 14 жовтня 2026

Джерело: локальний проєкт **Zapad Banka Mobile App Concept**, `src/prototype.css` (фінальний каскад), `src/Prototype.tsx`, `DESIGN_SYSTEM.md` та `docs/design-system/ICONS.md`. Код вебверсії не залежить від сусідньої папки.

- Обидва профілі використовують суцільну основну заливку, ті самі ink/muted/line/paper/selection та field-кольори. Disabled primary: `#e7ecf2` / `#536174`.
- Всі іконки React поточного src/, включно з UI-примітивами, меню, банківськими екранами та NFC картки, походять із Phosphor 2.1.10. Імпорти конкретних glyph-модулів запобігають завантаженню всього каталогу. Старі локальні назви деяких glyphs збережені через aliases. Тип даних іконок — Phosphor `Icon`.
- Службові іконки використовують `weight="regular"`; активна навігація — `fill`. `data-slot="functional-icon"` робить наявний контейнер прозорим, а glyph — нейтральним 24×24 px. Ініціали та валютні прапорці зберігають свою ідентичність. Inline chevrons і статусні ілюстрації мають власні розміри.
- Unbounded Medium збережено з мобільного проєкту; Onest замінив Inter у вебі за запитом 15.10.2026. Суми не використовують Unbounded. Ваги action 650 і text action 600 взяті з останнього CSS-правила мобільного проєкту.
- Адаптація для вебу: збережено desktop sidebar, ширину карток, маршрути та композицію сторінок. Business primary та аватари використовують актуальний `#A34900` з білим текстом (контраст 5.98:1); дрібний Business accent-текст використовує темніший похідний відтінок. Це явні відмінності для читабельності, а не інший основний колір.

Залежність Lucide збережена тільки для історичних preview-файлів у output/; поточний застосунок не імпортує її.

## 11. Інтерактивна вебгалерея

Запуск: `npm run dev`, потім відкрити [`/design-system.html`](/design-system.html). Production build містить окремі сторінки галереї та її iframe-зразків. Банківські hash-посилання `/#/design-system`, `/#/personal/design-system` і `/#/business/design-system` ведуть до галереї з відповідним контекстом.

- `?context=compare|personal|business` обирає порівняння або один профіль; `#<section>/<state>` фіксує зразок і стан. Наприклад: `/design-system.html?context=compare#button/disabled` або `/design-system.html?context=business#dialog/open`. Невідома секція відновлюється до `colors/default`, невідомий стан — до першого стану секції, невідомий контекст — до `compare`.
- Sidebar групує основи, контроли, вміст, структуру, навігацію, меню/попапи та банківський UI. Пошук знаходить назву, ідентифікатор, модуль або ключ стану; `/` переносить фокус до пошуку поза полями введення. На вузькому екрані каталог відкривається у Sheet.
- Personal і Business у порівнянні працюють у незалежних iframe. Перемикач адаптивності задає ширину зразка 360 px, обмежену доступним місцем; на вузькому host-екрані панелі стають одна під одною. Кожен iframe має власне прокручування, тому повні екрани можна оглядати без зменшення масштабу.
- Кнопки станів монтують відповідну композицію. Це справжні компоненти та providers застосунку, а не знімки чи нові копії примітивів. Позначені Button hover/focus-зразки фіксують вигляд для порівняння; реальні pointer і keyboard interactions залишаються доступними. Багатокрокові банківські сценарії продовжуються їхніми штатними діями.
- «Скинути» перемонтовує поточні iframe. Вибрані секція, стан і контекст зберігаються в URL, а введені дані й зміни зразка зникають. Зміна секції, стану або контексту також створює свіжий зразок.

### Джерела, ізоляція та межі покриття

[Каталог галереї](../src/app/design-system/catalogue.ts) описує **71 модуль у 62 логічних групах та 179 застосовних станах**. **268 експортів** реєстру використовуються як сімейства компонентів: наприклад, DialogTitle, DialogDescription і DialogFooter складають один діалог, а не окремі картки. Основи не додають вигаданих модулів. `RootLayout` показує 13 справжніх екранів; окремий стан `redirect` демонструє результат невізуального `ProfileRedirect`. Кількість станів описує каталог, а не повну матрицю всіх можливих поведінок, мов, даних та браузерів.

[Bootstrap iframe](../src/app/design-system/preview.tsx) встановлює окремі memory-only `localStorage`, `sessionStorage` та `document.cookie` **до** динамічного імпорту банківських модулів. Початкові profile/locale/fixture-значення записуються тільки в цю пам’ять. Це дає змогу досліджувати drafts, цілі, локальну історію та налаштування без читання чи перезапису збережених банківських даних користувача. Ізоляція є контрактом демонстраційного середовища, а не межею безпеки для недовіреного коду. Штатні copy/download-дії зразків можуть працювати; вони оперують лише демоданими.

Галерея використовує чинні CSS-токени, локальний Unbounded, Phosphor та assets. Нових залежностей або окремого візуального контракту немає. `DESIGN.md` залишається нормативним; галерея не замінює його та автоматично згенерований `UI_COMPONENTS.md`.

[Source coverage tests](../tests/design-system-gallery.test.cjs) перевіряють наявність кожного `.tsx`-модуля з `src/app/components` у каталозі, унікальність секцій/станів, fallback некоректного URL та незалежність memory Storage. Вони не доводять повне поведінкове покриття кожного експорту. Результати вибіркової браузерної перевірки та її межі: [QA report](qa/design-system-gallery/REPORT.md).

## Business material surfaces (2026-10-15)

Business now defaults to `--bank-material-canvas` and `--bank-material-surface`, with `--bank-material-edge` and `--bank-material-shadow`. The profile root supplies `--bank-paper`, `--card` and `--popover`; shared Card panels and explicitly marked legacy page panels receive the restrained elevation only inside Business. Personal is unchanged. Business Home shows the illustrative annual cash-flow chart without a query flag.

## Personal material surfaces (2026-10-15)

Personal applies the shared material-surface contract using a pale blue-grey canvas and porcelain cards, white edges and a quiet navy-tinted shadow. Personal tokens are isolated by `data-bank-profile="personal"`; Business retains its warm palette. Shared Card, explicit page panels and portalled task surfaces follow the profile tokens. Personal spending analytics uses blue/cyan/sage/slate gradients. Solid blue primary actions and payment-card artwork retain their established identity.

Cash-flow charts reuse `CashFlowAnalytics` with a keyed `profileKind`. The shared model in `data/cashFlow.ts` owns separate Personal and Business illustrative scenarios and profile-specific storage keys. Chart income/spending tokens select blue/cyan for Personal and blue/orange for Business.

Контроли вибору: checkbox/radio 20 px, switch 40×24 px із thumb 20 px та ходом 16 px. Зона натискання кожного — 44×44 px, включно зі switch; підписи відділені на 8 px. Checked, indeterminate, invalid, disabled та клавіатурний focus використовують спільні токени в обох профілях і портальних формах. [Перевірка залишкових стилів](qa/remaining-styles-2026-10-15/REPORT.md).
