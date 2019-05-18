module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '10.15.3'
        }
      }
    ]
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-object-rest-spread'
  ]
}
