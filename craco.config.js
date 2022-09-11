const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  webpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
            to: 'static/js',
          },
        ],
      }),
    ],
  },
};
