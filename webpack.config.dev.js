const
  path = require('path'),
  CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/main/js-reactify.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              declarationDir: 'types'
            }
          }
        }],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: [ '.js', '.ts', '.tsx' ]
  },

  output: {
    filename: 'js-reactify.development.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CompressionPlugin()
  ]
};
