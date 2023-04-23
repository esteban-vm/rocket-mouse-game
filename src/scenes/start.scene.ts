import Phaser from 'phaser'
import { Scenes } from '@/constants'

export default class Start extends Phaser.Scene {
  constructor() {
    super(Scenes.Start)
  }

  public create() {
    const { width: gameWidth, height: gameHeight } = this.scale

    const x = gameWidth / 2
    const y = gameHeight / 3

    const { android, iOS } = this.sys.game.device.os
    const isMobile = android || iOS

    const titleText = 'Rocket Mouse Game'
    const controlText = isMobile ? '- Touch the screen to play' : '- Press SPACE to play'

    const titleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '3rem',
      fontFamily: '"Hugmate", sans-serif',
      color: '#fff',
    }

    const controlStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      ...titleStyle,
      fontSize: isMobile ? '1.5rem' : '2rem',
    }

    this.add.text(x, y, titleText, titleStyle).setOrigin(0.5)
    this.add.text(x, y * 2, controlText, controlStyle).setOrigin(0.5)

    if (isMobile) {
      this.input.once('pointerup', this.startGame)
    } else {
      this.input.keyboard.once('keydown-SPACE', this.startGame)
    }
  }

  private startGame = () => {
    this.scene.stop(Scenes.Start)
    this.scene.start(Scenes.Main)
  }
}
