import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['src/app/features/*/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@nestjs/*',
                'rxjs',
                'class-validator',
                'class-transformer',
                '**/application/**',
                '**/infrastructure/**',
                '**/presentation/**',
              ],
              message:
                'Domain files cannot import external frameworks or outer architectural layers.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/app/features/*/application/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/infrastructure/**', '**/presentation/**'],
              message: 'Application layer cannot import infrastructure or presentation layers.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/app/features/*/infrastructure/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/presentation/**'],
              message: 'Infrastructure layer cannot import presentation layer.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/app/features/*/presentation/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/infrastructure/**'],
              message: 'Presentation layer cannot import infrastructure layer directly.',
            },
          ],
        },
      ],
    },
  },
];
