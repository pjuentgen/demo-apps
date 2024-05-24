/* eslint-disable no-undef */
module.exports = {
  plugins: ['@typescript-eslint', 'header', 'node', 'import', 'prettier'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: null,
    tsconfigRootDir: __dirname
  },
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    eqeqeq: ['error', 'smart'],
    'prefer-rest-params': 'off',
    'no-console': 'error',
    'no-shadow': 'off',
    'node/no-deprecated-api': ['warn'],
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Built-in imports (come from NodeJS native) go first
          'external', // <- External imports
          'internal', // <- Absolute imports
          ['sibling', 'parent'], // <- Relative imports, the sibling and parent types they can be mingled together
          'index', // <- index imports
          'unknown' // <- unknown
        ],
        'newlines-between': 'always',
        alphabetize: {
          /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
          order: 'asc',
          /* ignore case. Options: [true, false] */
          caseInsensitive: true
        }
      }
    ],
    'prettier/prettier': 2
  },
  overrides: [
    {
      files: ['tests/**/*'],
      env: {
        jest: true
      }
    },
    {
      files: ['./**/*.cjs'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier'
      ]
    },
    {
      files: ['*.json'],
      // Enable typescript-eslint for ts files.
      extends: ['plugin:json/recommended', 'prettier'],
      parserOptions: {
        project: './tsconfig.json'
      },
      rules: {}
    },
    {
      files: ['tests/**/*'],
      env: {
        jest: true
      }
    },
    {
      files: ['./**/*.cjs'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier'
      ]
    },
    {
      files: ['*.ts'],
      // Enable typescript-eslint for ts files.
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier'
      ],
      parserOptions: {
        project: './tsconfig.json'
      },
      rules: {
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'memberLike',
            modifiers: ['private', 'protected'],
            format: ['camelCase'],
            leadingUnderscore: 'require'
          }
        ],
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', args: 'after-used' }
        ],
        '@typescript-eslint/no-inferrable-types': [
          'error',
          { ignoreProperties: true }
        ],
        '@typescript-eslint/no-empty-function': ['off'],
        '@typescript-eslint/ban-types': [
          'warn',
          {
            types: {
              Function: null
            }
          }
        ],
        '@typescript-eslint/no-shadow': ['warn'],
        'prefer-rest-params': 'off',
        'prettier/prettier': 2
      }
    },
    {
      files: ['test/**/*.ts'],
      // Enable typescript-eslint for ts files.
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
      ],
      parserOptions: {
        project: './tsconfig.json'
      },
      rules: {
        'no-empty': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/ban-types': [
          'warn',
          {
            types: {
              Function: null
            }
          }
        ],
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-shadow': ['off'],
        '@typescript-eslint/no-floating-promises': ['off'],
        '@typescript-eslint/no-non-null-assertion': ['off'],
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
        'prefer-rest-params': 'off'
      }
    }
  ]
};
