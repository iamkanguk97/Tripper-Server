module.exports = {
    env: {
        browser: false,
        commonjs: true,
        es2021: true
    },
    extends: ['airbnb-base', 'prettier', 'plugin:node/recommended'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    // plugin: ['prettier'],
    // rules: {
    //     'prettier/prettier': 'error',
    //     'no-unused-vars': 'warn',
    //     'no-console': 'off',
    //     'func-names': 'off',
    //     'no-plusplus': 'off',
    //     'no-process-exit': 'off',
    //     'class-methods-use-this': 'off'
    // }
    rules: {
        'prettier/prettier': 'error',
        'no-unused-vars': 'error',
        'no-console': 'error',
        'func-names': 'error',
        'no-plusplus': 'error',
        'no-process-exit': 'error',
        'class-methods-use-this': 'error'
    }
};
