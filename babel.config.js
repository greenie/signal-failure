module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '8.10'
        }
      }
    ]
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-object-rest-spread'
  ]
}
