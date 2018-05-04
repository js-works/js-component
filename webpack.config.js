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
    entry: './src/main/js-remix.ts',
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
    externals: ['js-spec', 'react'],
    output: {
      filename: (typeName === 'umd' ? '' : `${typeName}/`) + `js-remix.${modeName}.js`,
      path: path.resolve(__dirname, 'dist'),
      library: 'jsRemix',
      libraryTarget: typeName === 'cjs' ? 'commonjs2' : typeName
    },
    plugins: [
      new CompressionPlugin()
    ]
  };
};
