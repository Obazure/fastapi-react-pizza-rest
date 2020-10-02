let rules = {
    'max-len': ['error', 120, 2, {ignoreUrls: true}],
    'no-console': [0],
    'no-restricted-syntax': 'off',
    'no-continue': 'off',
    'no-underscore-dangle': 'off',
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'operator-linebreak': 'off',
    'implicit-arrow-linebreak': 'off',
    'react/destructuring-assignment': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-filename-extension': [2, {extensions: ['.ts', '.tsx']}],
    'lines-between-class-members': [
        'error',
        'always',
        {exceptAfterSingleLine: true},
    ]
};

module.exports = {
    extends: ['react-app'],
    parser: 'babel-eslint',
    rules,
    env: {
        browser: true,
        commonjs: true,
        node: true,
        jest: true,
        es6: true,
    },
    plugins: ['react', 'react-hooks', 'jsx-a11y'],
    settings: {
        ecmascript: 6,
        jsx: true,
        'import/resolver': {
            node: {
                paths: ['src'],
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            },
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        react: {
            pragma: 'React',
            version: '16.8',
        },
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        },
        project: `./tsconfig.json`
    },
};
