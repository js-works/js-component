const
  path = require('path'),
  CompressionPlugin = require('compression-webpack-plugin');

module.exports = env => {
  const
    { mode, type } = env || {},
    modeName = mode === 'production' ? 'production' : 'development',
    typeName = ['cjs', 'amd'].includes(type) ? type : 'umd';

  return {
    mode: modeName,
    entry: './src/main/js-widgets.ts',
    devtool: modeName === 'production' ? false : 'inline-source-map',
    module: {
      unknownContextCritical: false,
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',

              options: {
                compilerOptions: {
                  declaration: true,
                  declarationDir: 'types'
                }
              }
            }
          ],
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.ts'],
      modules: ['node_modules'],
    },
    externals: {
      'js-spec': {
        amd: 'js-spec',
        commonjs: 'js-spec',
        commonjs2: 'js-spec',
        root: 'jsSpec'
      },

      'react': {
        amd: 'react',
        commonjs: 'react',
        commonjs2: 'react',
        root: 'React'
      }
    },
    output: {
      filename: (typeName === 'umd' ? '' : `${typeName}/`) + `js-widgets.${modeName}.js`,
      path: path.resolve(__dirname, 'dist'),
      library: 'jsWidgets',
      libraryTarget: typeName === 'cjs' ? 'commonjs2' : typeName
    },
    plugins: [
      new CompressionPlugin()
    ]
  };
};
