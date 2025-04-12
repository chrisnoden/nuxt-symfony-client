import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
    rules: {
        '@/indent': ['error', 4, { 'SwitchCase': 1 }],
        '@typescript-eslint/semi': 0,
        'baseIndent': 0,
        'brace-style': 'off',
        'import/extensions': 0,
        'import/no-extraneous-dependencies': 0,
        'import/no-unresolved': 0,
        'import/prefer-default-export': 0,
        'max-len': ['warn', { 'code': 160 }],
        'no-console': 'warn',
        'no-alert': 0,
        'no-param-reassign': 0,
        'no-undef': 0,
        'no-unused-vars': 'warn',
        'semi': 0,
        'spaced-comment': 'off',
        'strict': 0,
        'vue/html-indent': ['error', 4],
        'vue/multi-word-component-names': 0,
        'vue/no-multiple-template-root': 'off',
        'vue/object-property-newline': 'error',
    }
})
