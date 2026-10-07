const designSystem = require('./scripts/eslint/design-system.cjs');
const cssClasses = require('./scripts/design-system-css-classes.cjs');
const path = require('node:path');
const tailwindcss = require('eslint-plugin-tailwindcss');
const parser = require('@typescript-eslint/parser');
module.exports = [
  { ignores: ['node_modules/**', 'dist/**'] },
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { tailwindcss, 'design-system': designSystem },
    settings: { tailwindcss: {
      cssConfigPath: path.join(__dirname, 'src/styles/index.css'),
      functions: ['cn', 'cva', 'tv'],
    } },
    rules: {
      'tailwindcss/no-arbitrary-value': 'error',
      'design-system/require-cn': 'error',
      'tailwindcss/no-custom-classname': ['warn', { whitelist: cssClasses(
        ['index.css', 'theme.css', 'safari-fixes.css'].map(file => path.join(__dirname, 'src/styles', file))
      ) }],
    },
  },
];
