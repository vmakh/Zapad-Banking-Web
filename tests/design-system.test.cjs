const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

for (const [app, filePath, valid] of [
  ['zapad-webapp', 'src/app/components/PolicyProbe.tsx', 'cn("bg-brand-personal", active && "max-w-dialog-inset")'],
]) {
  test(`${app}: real config accepts theme classes and rejects policy violations`, () => {
    const cwd = root;
    const program = `
      const assert = require('node:assert/strict');
      const { ESLint } = require('eslint');
      (async () => {
        const eslint = new ESLint();
        const examples = [
          [${JSON.stringify(valid)}, null, 0],
          ['"w-[327px]"', 'tailwindcss/no-arbitrary-value', 2],
          ['cn("p-4", "hover:bg-[#1a1a1a]")', 'tailwindcss/no-arbitrary-value', 2],
          ['"invented-design-component"', 'tailwindcss/no-custom-classname', 1],
          ['\x60p-4 \x24{active ? "p-2" : "p-3"}\x60', 'design-system/require-cn', 2],
          ['["p-4", extra].join(" ")', 'design-system/require-cn', 2],
          ['active ? "p-4" : "p-2"', 'design-system/require-cn', 2],
        ];
        for (const [expression, rule, severity] of examples) {
          const [result] = await eslint.lintText('const Probe = () => <div className={' + expression + '} />;', { filePath: ${JSON.stringify(filePath)} });
          if (rule) assert(result.messages.some(m => m.ruleId === rule && m.severity === severity), JSON.stringify(result.messages));
          else assert.equal(result.messages.length, 0, JSON.stringify(result.messages));
        }
      })().catch(error => { console.error(error); process.exitCode = 1; });
    `;
    assert.doesNotThrow(() => execFileSync(process.execPath, ['-e', program], { cwd, stdio: 'pipe', timeout: 60000 }));
  });
}

test('semantic CSS allowlist uses exact selectors, not class prefixes', () => {
  const cssClasses = require('../scripts/design-system-css-classes.cjs');
  const patterns = cssClasses([path.join(root, 'src/styles/index.css')]);
  assert(patterns.some(p => new RegExp(p).test('dashboard-balance')));
  assert(!patterns.some(p => new RegExp(p).test('dashboard-balance-invented')));
});
