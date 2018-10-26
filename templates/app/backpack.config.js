const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

const modelsPath = path.join(__dirname, './src/models/');
const tsConfigPath = path.join(__dirname, '/tsconfig.json');

module.exports = {
  webpack: (config, options, webpack) => {
    config.entry.main = [
      './src/index.ts'
    ]


    config.resolve = {
      extensions: [".ts", ".tsx", ".js"],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: './tsconfig.json',
          extensions: [".ts", ".tsx"],
          mainFields: ["browser", "main"],
          baseUrl: "."
        })
      ]
    }

    config.module.rules.push({
      test: /\.ts$/,
      loader: 'awesome-typescript-loader'
    });

    return config
  }
}