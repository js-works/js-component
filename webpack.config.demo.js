const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/demo/demo.tsx',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: __dirname,
    openPage: 'src/demo/index.html'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['*', '.js', '.ts', '.tsx']
  },
  output: {
    filename: 'build/demo/demo-bundle.js',
  }
};
