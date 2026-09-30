import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', 'automation/data/'] },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
  {
    // Snippet oficial do gtag: precisa do objeto `arguments`.
    files: ["**/BaseLayout.astro", "**/BaseLayout.astro/**"],
    rules: { "prefer-rest-params": "off" },
  },
];
