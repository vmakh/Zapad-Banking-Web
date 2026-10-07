module.exports = {
  rules: {
    'require-cn': {
      meta: {
        type: 'problem',
        schema: [],
        messages: { merge: 'Use the shared cn() and complete static class names for conditional classes instead of concatenation, interpolated templates or join().' },
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name.name !== 'className' || node.value?.type !== 'JSXExpressionContainer') return;
            if (['ConditionalExpression', 'LogicalExpression'].includes(node.value.expression?.type)) {
              context.report({ node: node.value.expression, messageId: 'merge' });
              return;
            }
            const seen = new Set();
            function inspect(value) {
              if (!value || typeof value !== 'object' || seen.has(value)) return;
              seen.add(value);
              if ((value.type === 'TemplateLiteral' && value.expressions.length) ||
                  (value.type === 'BinaryExpression' && value.operator === '+') ||
                  (value.type === 'CallExpression' && value.callee.type === 'MemberExpression' &&
                   (value.callee.property.name === 'join' || value.callee.property.value === 'join'))) {
                context.report({ node: value, messageId: 'merge' });
                return;
              }
              for (const [key, child] of Object.entries(value)) {
                if (key === 'parent' || key === 'loc' || key === 'range') continue;
                if (Array.isArray(child)) child.forEach(inspect);
                else if (child?.type) inspect(child);
              }
            }
            inspect(node.value.expression);
          },
        };
      },
    },
  },
};
