// vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/~s200132/fishki/' : '/',
  pwa: {
    name: 'Fishki',
    themeColor: '#c47f7f',
    msTileColor: '#c47f7f',
    manifestOptions: {
      background_color: "#FFFFFF"
    }
  }
}
