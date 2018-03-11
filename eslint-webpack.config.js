const path = require('path');

module.exports = {
    resolve: {
        modules: [
            path.resolve(__dirname, './src'),
        ],
        alias: {
            '/ri': path.resolve(__dirname, './src'),
        },
        extensions: ['.js', '.jsx'],
    },
};
