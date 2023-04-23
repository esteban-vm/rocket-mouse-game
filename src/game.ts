import '@/game.css'
import Phaser from 'phaser'
import resize from '@/resize'
import * as Scenes from '@/scenes'

window.addEventListener('load', () => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 },
        // debug: true,
      },
    },
    scene: [Scenes.Preloader, Scenes.Start, Scenes.Main, Scenes.End],
  }

  const game = new Phaser.Game(config)

  window.focus()
  resize(game)
  window.addEventListener('resize', () => resize(game))
})
