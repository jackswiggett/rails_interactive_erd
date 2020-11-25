/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, '../engine/app/assets/javascripts/rails_interactive_erd'),
    filename: 'application.js',
    library: 'RailsInteractiveErd',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader'],
      },
      // CSS/SCSS modules
      {
        test: /\.module\.(css|scss)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: { localIdentName: '[local]__[hash:base64]' },
            },
          },
          'sass-loader',
        ],
      },
      // Other CSS/SCSS files
      {
        test: /\.(css|scss)$/,
        exclude: /\.module\.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
