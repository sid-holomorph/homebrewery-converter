import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'production',
  entry: './shared/naturalcrit/markdown.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'markdown-bundle.js',
    library: {
      name: 'HomebreweryMarkdown',
      type: 'module',
    },
  },
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                modules: false,
                targets: {
                  esmodules: true
                }
              }]
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json'],
    fallback: {
      "fs": false,
      "path": false,
      "crypto": false,
      "stream": false,
      "buffer": false,
      "util": false,
      "assert": false,
      "url": false,
      "os": false,
      "process": false
    }
  },
  externals: {
    'lodash': 'lodash',
    'marked': 'marked'
  }
};