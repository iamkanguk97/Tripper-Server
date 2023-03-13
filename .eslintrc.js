module.exports = {
    env: {
        browser: false,
        commonjs: true,
        es2021: true
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    extends: ['airbnb-base', 'prettier', 'plugin:prettier/recommended'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        'no-unused-vars': 'warn',
        'no-console': 'off',
        'func-names': 'off',
        'no-plusplus': 'off',
        'no-process-exit': 'off',
        'class-methods-use-this': 'off',
        'consistent-return': 'off',
        'no-underscore-dangle': 'off',
        'no-lonely-if': 'off',
        'max-classes-per-file': 'warn',
        radix: 'off'
    }
};
