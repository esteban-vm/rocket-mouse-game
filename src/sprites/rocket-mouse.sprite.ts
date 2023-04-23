import Phaser from 'phaser'
import { Animations, MouseState, Scenes, Textures } from '@/constants'

export default class RocketMouse extends Phaser.GameObjects.Container {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private flames: Phaser.GameObjects.Sprite
  private isMobile: boolean
  private mouse: Phaser.GameObjects.Sprite
  private pointer: Phaser.Input.Pointer
  public mouseState = MouseState.Running

  constructor(scene: Phaser.Scene, ...position: [x: number, y: number]) {
    super(scene, ...position)

    this.mouse = scene.add.sprite(0, 0, Textures.RocketMouse)
    this.mouse.setOrigin(0.5, 1)
    this.mouse.play(Animations.RocketMouseRun)

    this.flames = scene.add.sprite(-63, -15, Textures.RocketMouse)
    this.flames.play(Animations.RocketFlamesOn)

    this.enableJetpack(false)

    this.add(this.flames)
    this.add(this.mouse)

    scene.physics.add.existing(this)

    const mouseBody = this.body as Phaser.Physics.Arcade.Body
    const { width: mouseWidth, height: mouseHeight } = this.mouse
    mouseBody.setSize(mouseWidth * 0.5, mouseHeight * 0.7)
    mouseBody.setOffset(mouseWidth * -0.3, -mouseHeight + 15)

    const { android, iOS } = scene.sys.game.device.os
    this.isMobile = android || iOS

    this.cursors = scene.input.keyboard.createCursorKeys()
    this.pointer = scene.input.activePointer
  }

  public preUpdate() {
    const mouseBody = this.body as Phaser.Physics.Arcade.Body

    switch (this.mouseState) {
      case MouseState.Running: {
        const { cursors, isMobile, pointer } = this
        const touchingSpace = !isMobile && cursors.space.isDown
        const touchingScreen = isMobile && pointer.isDown

        if (touchingSpace || touchingScreen) {
          mouseBody.setAccelerationY(-600)
          this.enableJetpack(true)
          this.mouse.play(Animations.RocketMouseFly, true)
          navigator.vibrate(10)
        } else {
          mouseBody.setAccelerationY(0)
          this.enableJetpack(false)
        }

        const mouseRunning = mouseBody.blocked.down
        const mouseFalling = mouseBody.velocity.y > 0

        if (mouseRunning) {
          this.mouse.play(Animations.RocketMouseRun, true)
        } else if (mouseFalling) {
          this.mouse.play(Animations.RocketMouseFall, true)
        }

        break
      }

      case MouseState.Killed: {
        mouseBody.velocity.x *= 0.99

        if (mouseBody.velocity.x <= 5) {
          this.mouseState = MouseState.Dead
        }

        break
      }

      case MouseState.Dead: {
        mouseBody.setVelocity(0)
        this.scene.scene.run(Scenes.End)
        break
      }
    }
  }

  private enableJetpack(enabled: boolean) {
    this.flames.setVisible(enabled)
  }

  public kill() {
    if (this.mouseState !== MouseState.Running) return

    this.mouseState = MouseState.Killed
    this.mouse.play(Animations.RocketMouseDead)
    this.enableJetpack(false)

    const mouseBody = this.body as Phaser.Physics.Arcade.Body
    mouseBody.setAccelerationY(0)
    mouseBody.setVelocity(1_000, 0)
  }
}
