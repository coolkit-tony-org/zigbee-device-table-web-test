// commitlint.config.js

/**
 * @type {import('cz-git').UserConfig}
 */
module.exports = {
    ignores: [(commit) => commit.includes('init')],
    extends: ['@commitlint/config-conventional'],
    rules: {
        'body-leading-blank': [2, 'always'],
        'footer-leading-blank': [1, 'always'],
        'header-max-length': [2, 'always', 50],
        'subject-empty': [2, 'never'],
        'type-empty': [2, 'never'],
        'subject-case': [0],
        'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'revert', 'chore']],
        // 自定义规则：禁止提交信息包含中文字符
        'no-chinese': [2, 'always'],
    },
    /** 本配置仅用于交互工具（cz-git），纯 git commit 不走此配置 */
    prompt: {
        alias: {
            f: 'docs: fix typos',
            r: 'docs: update README',
            s: 'style: update code format',
            b: 'build: bump dependencies',
            c: 'chore: update config',
        },
        customScopesAlign: 'top',
        defaultScope: ['room'],
        scopes: [],
        allowCustomScopes: true,
        allowEmptyScopes: true,
        allowEmptyIssuePrefixs: true,
        allowCustomIssuePrefixs: true,
        messages: {
            type: '选择你要提交的类型 :',
            scope: '选择一个提交范围（可选）:',
            customScope: '请输入自定义的提交范围 :',
            subject: '填写简短精炼的变更描述 :\n',
            body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
            confirmCommit: '是否提交或修改commit ?',
        },
        types: [
            { value: 'feat', name: 'feat:      ✨ 新增功能 | A new feature', emoji: '✨' },
            { value: 'fix', name: 'fix:       🐞 修复缺陷 | A bug fix', emoji: '🐞' },
            { value: 'docs', name: 'docs:      📝 文档更新 | Documentation only changes', emoji: '📝' },
            { value: 'style', name: 'style:     💄 代码格式 | Changes that do not affect the meaning of the code', emoji: '💄' },
            { value: 'refactor', name: 'refactor:  ♻️  代码重构 | A code change that neither fixes a bug nor adds a feature', emoji: '♻️' },
            { value: 'perf', name: 'perf:      ⚡️ 性能提升 | A code change that improves performance', emoji: '⚡️' },
            { value: 'test', name: 'test:      ✅ 测试相关 | Adding missing tests or correcting existing tests', emoji: '✅' },
            { value: 'build', name: 'build:     📦️ 构建相关 | Changes that affect the build system or external dependencies', emoji: '📦️' },
            { value: 'ci', name: 'ci:        🎡 持续集成 | Changes to our CI configuration files and scripts', emoji: '🎡' },
            { value: 'revert', name: 'revert:    🔨 回退代码 | Revert to a commit', emoji: '🔨' },
            { value: 'chore', name: 'chore:     ⏪️ 其他修改 | Other changes that do not modify src or test files', emoji: '⏪️' },
        ],
        useEmoji: true,
        emojiAlign: 'center',
        skipQuestions: ['breaking', 'footer', 'footerPrefix'],
        breaklineNumber: 100,
        breaklineChar: '|',
        confirmColorize: true,
        minSubjectLength: 0,
        scopeOverrides: undefined,
        defaultBody: '',
        defaultIssues: '',
        defaultSubject: '',
    },
    plugins: [
        {
            rules: {
                'no-chinese': ({ header, body, footer }) => {
                    const chineseRegex = /[\u4e00-\u9fa5]/;
                    const hasChinese = chineseRegex.test(header) || chineseRegex.test(body) || chineseRegex.test(footer);
                    return [!hasChinese, 'No Chinese in commit message is allowed, please use English instead.'];
                },
            },
        },
    ],
};
