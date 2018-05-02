const
  path = require('path'),
  HtmlWebpackPlugin  = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'web',
  context: path.resolve(__dirname),
  entry: {demo: './src/demo/demo.tsx'},
  devtool: 'inline-source-map',
  devServer: {
    openPage: 'demo/demo.html',
  },
  //externals: ['react', 'react-dom'],
  /*
  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    },
    {
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      }
    }
  ],
  */
  module: {
    unknownContextCritical: false,
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [{
          loader: 'awesome-typescript-loader',
          options: {
            compilerOptions: {
              module: 'umd',
              declaration: false,
              declarationDir: null 
            }
          }
        }],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    //enforceExtension: false,
    //modules: ['.', 'src', path.resolve(__dirname, 'node_modules'), __dirname],
    extensions: ['.js', '.ts', '.tsx'],
    //modules: [path.resolve(__dirname, 'node_modules')],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      'js-reactify$': path.resolve(__dirname, 'src/main/js-reactify')
    }
    //alias: {
    //  'react$': path.resolve(__dirname, 'node_modules/react/umd/react.development.js'),
    //  'react-dom$': path.resolve(__dirname, 'node_modules/react-dom/umd/react-dom.development.js')
    //}
  },
  output: {
    filename: 'demo/demo-bundle.js',
    libraryTarget: 'umd'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'demo/demo.html',
      template: 'src/demo/demo.tmpl',
      inject: 'body'
    })
  ]
};

