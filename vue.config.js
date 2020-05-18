module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/test/',
  runtimeCompiler: true,
  'transpileDependencies': [
    'vuetify'
  ]
}
