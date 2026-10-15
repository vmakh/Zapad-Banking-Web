const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const target = path.join(root, 'docs/UI_COMPONENTS.md');
const descriptions = {
  accordion: 'Розкривні секції', 'alert-dialog': 'Підтвердження важливої дії', alert: 'Повідомлення про стан',
  'aspect-ratio': 'Стабільне співвідношення сторін', avatar: 'Зображення користувача та fallback',
  badge: 'Позначка стану', breadcrumb: 'Навігаційний шлях', button: 'Дія або посилання з варіантами',
  calendar: 'Вибір дати', card: 'Картка вмісту', carousel: 'Карусель', chart: 'Графік і підказки Recharts',
  checkbox: 'Вибір логічного значення', collapsible: 'Згортання вмісту', command: 'Пошук і список команд',
  'context-menu': 'Контекстне меню', dialog: 'Модальне вікно', drawer: 'Висувна панель',
  'dropdown-menu': 'Меню дій', form: 'Поля react-hook-form', 'hover-card': 'Додатковий вміст при наведенні',
  input: 'Однорядкове поле', 'input-otp': 'Код підтвердження', label: 'Підпис поля', menubar: 'Панель меню',
  'navigation-menu': 'Навігаційне меню', pagination: 'Пагінація', popover: 'Спливний вміст',
  progress: 'Прогрес', 'radio-group': 'Вибір одного варіанта', resizable: 'Панелі зі змінним розміром',
  'scroll-area': 'Область прокручування', select: 'Вибір зі списку', separator: 'Роздільник',
  sheet: 'Бічна модальна панель', sidebar: 'Бічна навігація', skeleton: 'Стан завантаження', slider: 'Вибір діапазону',
  sonner: 'Toast-повідомлення', switch: 'Перемикач', table: 'Табличні дані', tabs: 'Вкладки',
  textarea: 'Багаторядкове поле', toggle: 'Кнопка-перемикач', 'toggle-group': 'Група перемикачів', tooltip: 'Коротка підказка',
  BalanceHero: 'Баланс і вибір активного рахунку', AccountsStrip: 'Список рахунків',
  CurrencyIcon: 'Прапорець або символ валюти', PaymentCard: 'Артворк платіжної картки',
  LanguageSwitcher: 'Вибір мови: повний або компактний', Sidebar: 'Навігація банківського workspace',
  TopBar: 'Пошук, профіль, приватність і мова', Transactions: 'Список операцій',
  TransactionDetailsSheet: 'Деталі операції', TransactionExtras: 'Нотатки та експорт операції',
  ExpenseAnalytics: 'Аналітика демонстраційних витрат', SavingsGoals: 'Огляд цілей заощадження',
  GoalDialog: 'Керування ціллю', TransferModal: 'Демонстраційний переказ', ReceiveSheet: 'Реквізити отримання',
  ExchangeModal: 'Перехід до обміну валют', ProductPreviewDialog: 'Попередній перегляд продукту',
  PreviewHistory: 'Історія локальних preview', RightPanel: 'Банківські віджети та сповіщення',
  QuickActions: 'Швидкі банківські дії', DashboardPaymentsCta: 'Переходи до платежів',
  IconScaleSlot: 'Обгортка іконки зі стабільними розмірами',
};
function files(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]); }
function cell(text) { return text.replace(/\s+/g, ' ').replaceAll('|', '&#124;').replaceAll('`', '&#96;').trim(); }
function rows(file, importPath, local = false) {
  const source = fs.readFileSync(file, 'utf8');
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const declarations = new Map(), exported = new Set();
  for (const s of ast.statements) {
    if (s.name) declarations.set(s.name.text, s);
    if (ts.isVariableStatement(s)) for (const d of s.declarationList.declarations) declarations.set(d.name.getText(ast), d);
    if (s.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword) && s.name) exported.add(s.name.text);
    if (ts.isExportDeclaration(s) && s.exportClause && ts.isNamedExports(s.exportClause)) {
      for (const e of s.exportClause.elements) if (!e.isTypeOnly) exported.add(e.propertyName?.text || e.name.text);
    }
    if (ts.isVariableStatement(s) && s.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      for (const d of s.declarationList.declarations) exported.add(d.name.getText(ast));
    }
  }
  const result = [];
  for (const [name, declaration] of declarations) {
    if (!/^[A-Z]/.test(name) || (!local && !exported.has(name))) continue;
    let fn = declaration;
    if (ts.isVariableDeclaration(fn)) fn = fn.initializer;
    if (!fn || ts.isTypeAliasDeclaration(fn) || ts.isInterfaceDeclaration(fn)) continue;
    if (!ts.isFunctionDeclaration(fn) && !ts.isArrowFunction(fn) && !ts.isCallExpression(fn) && !ts.isPropertyAccessExpression(fn) && !ts.isIdentifier(fn)) continue;
    // Only callable declarations / exported primitive aliases, not uppercase constants.
    if (local && !ts.isFunctionDeclaration(fn)) continue;
    let props = fn.parameters?.[0]?.type?.getText(ast);
    if (props && declarations.has(props)) {
      const type = declarations.get(props);
      if (ts.isInterfaceDeclaration(type)) props = type.members.map(m => m.getText(ast)).join(' ');
      else if (ts.isTypeAliasDeclaration(type)) props = type.type.getText(ast);
    }
    if (!props && ts.isCallExpression(fn)) props = fn.typeArguments?.map(t => t.getText(ast)).join('; ') || 'API обгорнутого примітива; див. вихідний код';
    if (!props) props = fn.parameters?.length ? fn.parameters[0].getText(ast) : (ts.isFunctionDeclaration(fn) ? 'Немає' : `API ${fn.getText(ast)}`);
    const relative = path.relative(root, file).split(path.sep).join('/');
    const line = ast.getLineAndCharacterOfPosition(declaration.getStart(ast)).line + 1;
    const base = path.basename(file, '.tsx');
    const usage = descriptions[base] || name.replace(/([a-z])([A-Z])/g, '$1 $2');
    result.push(`| ${name} | ${local ? 'Локальний у модулі; не імпортувати' : `\`${importPath}\``} | ${cell(props)} | ${usage}; API — [джерело](../${relative}#L${line}) |`);
  }
  return result;
}
const webBase = path.join(root, 'src/app/components');
const componentFiles = files(webBase).filter(f => f.endsWith('.tsx')).sort();
const imports = new Map(componentFiles.map(file => [file, new Map()]));
// Direct value imports only: this is a source inventory, not runtime reachability.
for (const file of files(path.join(root, 'src')).filter(f => /\.[jt]sx?$/.test(f)).sort()) {
  const ast = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  for (const statement of ast.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const clause = statement.importClause;
    if (!clause || clause.isTypeOnly) continue;
    const specifier = statement.moduleSpecifier.text;
    const base = specifier.startsWith('@/') ? path.join(root, 'src', specifier.slice(2))
      : specifier.startsWith('.') ? path.resolve(path.dirname(file), specifier) : null;
    if (!base) continue;
    const targetFile = [base, `${base}.tsx`, path.join(base, 'index.tsx')].find(candidate => imports.has(candidate));
    if (!targetFile) continue;
    const names = [];
    if (clause.name) names.push('default');
    if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
      for (const binding of clause.namedBindings.elements) {
        if (!binding.isTypeOnly) names.push((binding.propertyName || binding.name).text);
      }
    } else if (clause.namedBindings) names.push('*');
    if (names.length) imports.get(targetFile).set(file, names);
  }
}
const relativeLink = file => `[${path.relative(path.join(root, 'src'), file).split(path.sep).join('/')}](../${path.relative(root, file).split(path.sep).join('/')})`;
const moduleRows = componentFiles.map(file => {
  const consumers = imports.get(file);
  const names = [...new Set([...consumers.values()].flat())].sort();
  const product = [...consumers.keys()].filter(consumer => !consumer.startsWith(path.join(webBase, 'ui') + path.sep));
  const primitives = [...consumers.keys()].filter(consumer => consumer.startsWith(path.join(webBase, 'ui') + path.sep));
  return `| ${relativeLink(file)} | ${names.length ? names.map(name => `\`${name}\``).join(', ') : '—'} | ${product.map(relativeLink).join('<br>') || '—'} | ${primitives.map(relativeLink).join('<br>') || '—'} |`;
});
const usage = `## Прямі імпорти модулів (${componentFiles.length})\n\nЦя таблиця сканує value-import у файлах src/. Вона відрізняє імпорти з екранів і банківських компонентів від внутрішніх залежностей бібліотеки ui/. Імпорт не доводить, що компонент відображається на поточному маршруті. «—» означає відсутність прямих імпортів; це не рекомендація видаляти модуль. Локальні компоненти сторінок, hooks і зовнішні бібліотеки не входять до каталогу експортованих компонентів.\n\n| Модуль (від src/) | Імпортовані експорти | Імпортується поза ui/ | Імпортується всередині ui/ |\n| --- | --- | --- | --- |\n${moduleRows.join('\n')}\n\n`;
const web = componentFiles.flatMap(f => rows(f, '@/app/components/' + path.relative(webBase, f).replace(/\.tsx$/, '').split(path.sep).join('/')));
const table = '| Назва | Шлях імпорту (від src) | Ключові Props / успадкований API | Використання |\n| --- | --- | --- | --- |\n';
const output = `# UI component registry\n\nЗгенеровано командою npm run generate:ui-registry з поточного коду. Не редагувати вручну: зміни перезаписуються генератором.\n\n[Дизайн-система і практичні контракти](DESIGN_SYSTEM.md) · [Візуальні правила](../DESIGN.md)\n\nReact/Vite, Tailwind 4. Alias @/ maps to src/. Use shared cn() from @/app/components/ui/utils. Theme: src/styles/theme.css, src/styles/design-system.css and the final overrides in src/styles/index.css.\n\n${usage}## Exported components (${web.length})\n\nЦе доступні експорти, включно з примітивами без прямих імпортів. Props витягнуто зі синтаксису TypeScript; успадкований API, значення за замовчуванням і поведінку перевіряйте за посиланням на джерело.\n\n${table}${web.join('\n')}\n`;
if (process.argv.includes('--check')) {
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== output) { console.error('UI registry is stale. Run npm run generate:ui-registry'); process.exitCode = 1; }
  else console.log(`UI registry matches source: ${web.length} entries.`);
} else { fs.writeFileSync(target, output); console.log(`Generated ${web.length} entries.`); }
