# Investment overview review — 29 September 2026

## References inspected

Screens retrieved through the Mobbin plugin. These are captured design references, not claims about the current live products.

- [Gemini portfolio](https://mobbin.com/screens/cc6a1261-a495-4977-8ca8-36d9a20b46db): explicit periods, valuation chart and asset balances.
- [Copilot Money investments](https://mobbin.com/screens/df0a19e8-30c4-4d6a-8855-7060478380ac): estimated balance terminology, periods and account-level drill-down. A personal-finance aggregator, not a brokerage execution reference.
- [Kraken overview](https://mobbin.com/screens/9ea34e68-7bd9-4212-b36f-ed7a9bde83e3): distinguishes balance change from unrealized return. Crypto trading conventions should not be copied indiscriminately into bank investment UX.
- [Revolut portfolio valuation](https://help.revolut.com/help/wealth/stocks/getting-started-with-trading/managing-your-trading-account/how-is-the-portfolio-value-calculated/): indicative valuation uses last available security prices and cash.
- [Fidelity performance methodology](https://www.fidelity.com/webcontent/ap002390-mlo-content/20.04/help/learn_performancereporting.shtml): cash flows and fees matter when interpreting investment returns.

## Changes implemented

- Explicit demo valuation date and EUR reporting currency.
- Working 7D / 30D controls use the available sample history; summary and chart use the same endpoints. No fabricated 1Y or all-time history.
- Clarify that the displayed change is illustrative value change, under assumptions of no cash flows or distributions, excluding fees and taxes. It is not an actual account performance calculation.
- Expandable methodology and accessible data table; hidden balances also hide history values.
- Calculate allocation from asset values rather than independently hardcoded percentages.
- Label asset-class changes as 30-day changes independently of the chart period.
- Wrap asset rows on narrow screens; defer two-column breakdown until wider screens.
- Use theme chart tokens and quiet progress bars; retain one primary investing action.

## Boundaries

The data describes asset classes, not security-level holdings. Do not invent quantities, ISINs, cost basis, unrealized profit, available investment cash, actual orders, benchmark history or execution fees. Those require a trustworthy data model/feed. The investment preview already explains capital risk and that no order is placed. This pass does not add trading, personalized advice, or promised returns.

## Validation

Browser: 7D switches the summary and chart endpoints; expanded table exposes the same points. Design-system checks and application build run for the patch.

## Expanded Mobbin comparison — 30 September 2026

Two further plugin searches returned eight iOS and six web screens. All 14 previews were inspected; one (Gemini) repeats the original sample. Combined with the original three, this is **16 distinct screens across 13 products**, not 17 independent references. These are captured interfaces, not verification of current product availability. The sample is qualitative and search-ranked, not a usability study.

| Inspected screen | Visible pattern | Decision for this prototype |
|---|---|---|
| [Crypto.com](https://mobbin.com/screens/e7692910-6ec0-4d66-8012-22ec1959bfc4) | Total balance, 24-hour profit label, period chips, asset quantities | Keep period-specific labels; do not copy short-term trading emphasis or fabricate asset quantities. |
| [Binance](https://mobbin.com/screens/a88004b7-9793-49a3-abb2-7123842779f6) | Allocation with values; a separate profit/loss ranking | Allocation and return are distinct quantities. Do not introduce a winners/losers ranking into this bank overview. |
| [Fidelity](https://mobbin.com/screens/0dd015e1-3253-461b-bbd5-6625be377fb5) | Account valuation, time controls, separate available-to-trade and available-to-withdraw balances, activity | Make clear that portfolio value is not available cash. The current dataset cannot supply real trading/withdrawal availability. |
| [N26](https://mobbin.com/screens/72c8c8b6-fd26-4395-b7b9-240c52ee60aa) | Portfolio/Explore separation, valuation timestamp, chart periods, Invest/Plans/History actions | Retain valuation date and bounded period controls. Existing local investment preview links to Activity; do not label it order history. |
| [Kraken](https://mobbin.com/screens/a5aa5891-8b8d-43f5-b4db-78883e599bd0) | Separate Crypto and Cash groups, transaction feedback, Transfer and Trade | Reinforces cash/valuation distinction. Rewards and crypto yield badges are not suitable evidence for bank investment returns. |
| [Coinbase](https://mobbin.com/screens/e65a4643-7da5-47f9-b7f5-2d2ea630c865) | Separate Crypto/Cash balances, period selection, prominent promotions | Retain balance semantics; reject promotional competition with the main task. |
| [Acorns](https://mobbin.com/screens/0dd296f5-10aa-4298-b24b-1eefb3cd110b) | Asset-class groups beneath allocation; return has an All time label | Preserve asset-class granularity and return period labels. Avoid making a ring imply guaranteed progress. |
| [Copilot Money iOS](https://mobbin.com/screens/55108ff4-c9f9-4e1f-bdd3-3255c0ee835a) | Live balance estimate wording, holdings update timestamp, quantities and values | Distinguish estimate/freshness. Our date remains explicitly a demo date; no live-data implication. |
| [Quicken](https://mobbin.com/screens/90f1883e-debb-446c-9914-4fb2a1f21acf) | Separate Portfolio/Balances/Performance/Transactions, total cost and gain, account table | Cost basis and gains need their own source data. Do not reinterpret current sample value change as realized/unrealized profit. |
| [Monarch](https://mobbin.com/screens/41098dbd-0c6a-4dc4-99ef-eeacf7812f4d) | Holdings/Allocation, selected period, account filter, price/quantity/value columns | One coherent time range per metric; no invented security table when the dataset only contains asset classes. |
| [Copilot Money web](https://mobbin.com/screens/758a31a0-619b-401e-95e1-98907f5fe46c) | Account-level drilldown, comparison chart, holdings and closed-account state | Account drilldown and benchmarks need trustworthy data. Keep unavailable comparison/order features out of the prototype. |
| [Origin](https://mobbin.com/screens/3a516cce-bf0f-4eb8-90d7-1625e5d49c32) | Explicit benchmark series, selected range and account list, holdings values | Benchmarks must use compatible methodology/periods; do not synthesize an index for visual richness. |
| [Gemini](https://mobbin.com/screens/cc6a1261-a495-4977-8ca8-36d9a20b46db) | Primary account, time range, account snapshots and trading balances | Rechecked existing reference. Account context matters; this is not evidence for adding bank brokerage cash. |
| [Fey](https://mobbin.com/screens/f4b1fb8e-1db1-407c-a1b1-41ec1eb312c7) | Watchlist vs market, selected long period, share price and return columns | Watchlist is distinct from owned holdings; no ownership inference or speculative trading widgets. |

### Gaps resolved after comparison

- Portfolio summary now explicitly states that its value is not an available cash balance.
- Capital-risk context is visible in the page introduction next to the main action, rather than only at the end of the page or inside the investment dialog.
- Asset allocation bars now render their numeric proportions immediately. Removed staggered width animation (layout work and misleading temporary zero widths); runtime width uses the raw allocation, not a locale-formatted number.

### Evidence and limits

Existing period/valuation/methodology/table features were inspected in source before deciding changes. This comparison does not prove that every reference is good, that competitors satisfy accessibility standards, or that sample rates/product fees are real. The implementation remains an honest interactive prototype, with local previews rather than trade execution. Browser/layout verification for this delta is recorded in the implementation log.
