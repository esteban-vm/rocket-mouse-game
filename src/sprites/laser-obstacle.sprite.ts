import Phaser from 'phaser'
import { Textures } from '@/constants'

export default class LaserObstacle extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, ...position: [x: number, y: number]) {
    super(scene, ...position)

    const top = scene.add.image(0, 0, Textures.LaserEnd)
    top.setOrigin(0.5, 0)

    const middle = scene.add.image(0, top.y + top.displayHeight, Textures.LaserMiddle)
    middle.setOrigin(0.5, 0)
    middle.setDisplaySize(middle.width, 150)

    const bottom = scene.add.image(0, middle.y + middle.displayHeight, Textures.LaserEnd)
    bottom.setOrigin(0.5, 0)
    bottom.setFlipY(true)

    this.add(top)
    this.add(middle)
    this.add(bottom)

    scene.physics.add.existing(this, true)

    const laserBody = this.body as Phaser.Physics.Arcade.StaticBody
    const laserWidth = top.displayWidth
    const laserHeight = top.displayHeight + middle.displayHeight + bottom.displayHeight

    laserBody.setSize(laserWidth * 0.5, laserHeight)
    laserBody.setOffset(laserWidth * -0.25, 0)
    laserBody.position.x = this.x + laserBody.offset.x
    laserBody.position.y = this.y
  }
}
