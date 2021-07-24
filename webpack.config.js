const { resolve } = require("path")
const { name } = require("./package.json")
const TypescriptDeclarationPlugin = require('typescript-declaration-webpack-plugin');

module.exports = {
  entry: './src/lanyard.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: `${name}.js`,
    library: {
        name: "lanyard",
        type: 'umd',
        export: 'default',
    },
    globalObject: 'this'
  },
  externals: {
    "node-fetch": {
      commonjs: 'node-fetch',
      commonjs2: 'node-fetch'
    },
    "ws": {
      commonjs: 'isomorphic-ws/node.js',
      commonjs2: 'isomorphic-ws/node.js'
    },
  },
  plugins: [
    new TypescriptDeclarationPlugin({
        out: `${name}.d.ts`,
    })
  ]
};
