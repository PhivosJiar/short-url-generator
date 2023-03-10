module.exports = {
  extends: ['eason', 'next/core-web-vitals', 'plugin:prettier/recommended'],
  rules: {
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
  },
  overrides: [
    {
      files: '**/*.{ts,tsx}',
      extends: ['eason/typescript', 'plugin:prettier/recommended'],
      rules: {
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        'no-unused-vars': 'warn',
      },
    },
  ],
};
