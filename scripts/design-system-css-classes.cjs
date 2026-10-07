const fs = require('node:fs');
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

// Exact class selectors in the supplied authored stylesheets, never a wildcard.
// Changes to these stylesheets remain subject to token/duplication review.
module.exports = function cssClasses(paths) {
  const classes = new Set();
  for (const file of paths) {
    postcss.parse(fs.readFileSync(file, 'utf8'), { from: file }).walkRules(rule => {
      selectorParser(root => root.walkClasses(node => classes.add(node.value))).processSync(rule.selector);
    });
  }
  return [...classes].sort().map(name => `^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
};
