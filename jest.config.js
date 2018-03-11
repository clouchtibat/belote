module.exports = {
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/registerServiceWorker.js',
        '!src/index.js',
        '!src/commons/redux/history.js',
        '!src/commons/redux/store.js',
        '!src/i18n/**',
        '!src/mocks/**',
        '!src/**/props.js',
        '!src/**/index.js',
        '!src/utils/settings.js',
        '!src/utils/tests/**',
    ],
    setupFiles: ['<rootDir>/config/polyfills.js'],
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.js?(x)',
        '<rootDir>/src/**/?(*.)(spec|test).js?(x)',
    ],
    testEnvironment: 'node',
    testURL: 'http://localhost',
    transform: {
        '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
        '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
        '^(?!.*\\.(js|jsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
    moduleNameMapper: {
        '^react-native$': 'react-native-web',
        '/ri[/](.+)': '<rootDir>/src/$1',
    },
    moduleFileExtensions: ['web.js', 'js', 'json', 'web.jsx', 'jsx'],
};
