import Phaser from 'phaser'
import { Scenes } from '@/constants'

export default class End extends Phaser.Scene {
  constructor() {
    super(Scenes.End)
  }

  public create() {
    const { width: gameWidth, height: gameHeight } = this.scale

    const x = gameWidth * 0.5
    const y = gameHeight * 0.5

    const { android, iOS } = this.sys.game.device.os
    const isMobile = android || iOS

    const text = isMobile ? 'Touch the screen to play again' : 'Press SPACE to play again'

    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: isMobile ? '1.5rem' : '2rem',
      fontFamily: '"Hugmate", sans-serif',
      color: '#fff',
      backgroundColor: '#000',
      padding: {
        left: 15,
        right: 15,
        top: 15,
        bottom: 15,
      },
    }

    this.add.text(x, y, text, textStyle).setOrigin(0.5)

    if (isMobile) {
      this.input.once('pointerup', this.restartGame)
    } else {
      this.input.keyboard.once('keydown-SPACE', this.restartGame)
    }
  }

  private restartGame = () => {
    this.scene.stop(Scenes.End)
    this.scene.stop(Scenes.Main)
    this.scene.start(Scenes.Main)
  }
}
