const
  path = require('path'),
  CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/main/js-reactify.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: [ '.js', '.ts', '.tsx' ]
  },
  output: {
    filename: 'js-reactify.production.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CompressionPlugin()
  ]
};
