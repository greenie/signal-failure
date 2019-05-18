module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: false,
    node: true,
    mocha: true
  },
  extends: [
    'standard',
    'plugin:import/recommended'
  ],
  rules: {
    'import/order': 'error'
  }
}
