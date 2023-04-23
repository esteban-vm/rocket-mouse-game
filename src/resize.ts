import Phaser from 'phaser'

export default (game: Phaser.Game) => {
  const canvas = document.querySelector('canvas') as HTMLCanvasElement

  const { innerWidth: windowWidth, innerHeight: windowHeight } = window
  const { width: gameWidth, height: gameHeight } = game.config

  const windowRatio = windowWidth / windowHeight
  const gameRatio = +gameWidth / +gameHeight

  const isFullWidth = windowRatio < gameRatio

  canvas.style.width = `${isFullWidth ? windowWidth : windowHeight * gameRatio}px`
  canvas.style.height = `${isFullWidth ? windowWidth / gameRatio : windowHeight}px`
}
