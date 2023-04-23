import Phaser from 'phaser'
import { MouseState, Scenes, Sounds, Textures } from '@/constants'
import { LaserObstacle, RocketMouse } from '@/sprites'

export default class Main extends Phaser.Scene {
  private background!: Phaser.GameObjects.TileSprite
  private bookcase1!: Phaser.GameObjects.Image
  private bookcase2!: Phaser.GameObjects.Image
  private bookcases!: Phaser.GameObjects.Image[]
  private coins!: Phaser.Physics.Arcade.StaticGroup
  private laserObstacle!: LaserObstacle
  private mouseHole!: Phaser.GameObjects.Image
  private rocketMouse!: RocketMouse
  private score!: number
  private scoreLabel!: Phaser.GameObjects.Text
  private window1!: Phaser.GameObjects.Image
  private window2!: Phaser.GameObjects.Image
  private windows!: Phaser.GameObjects.Image[]

  constructor() {
    super(Scenes.Main)
  }

  public init() {
    this.bookcases = []
    this.score = 0
    this.windows = []
  }

  public create() {
    const gameWidth = this.scale.width
    const gameHeight = this.scale.height

    this.background = this.add.tileSprite(0, 0, gameWidth, gameHeight, Textures.Background)
    this.background.setOrigin(0)
    this.background.setScrollFactor(0)

    this.mouseHole = this.add.image(Phaser.Math.Between(900, 1_500), 501, Textures.MouseHole)

    this.window1 = this.add.image(Phaser.Math.Between(900, 1_300), 200, Textures.Window1)
    this.windows.push(this.window1)

    this.window2 = this.add.image(Phaser.Math.Between(1_600, 2_000), 200, Textures.Window2)
    this.windows.push(this.window2)

    this.bookcase1 = this.add.image(Phaser.Math.Between(2_200, 2_700), 580, Textures.Bookcase1)
    this.bookcase1.setOrigin(0.5, 1)
    this.bookcases.push(this.bookcase1)

    this.bookcase2 = this.add.image(Phaser.Math.Between(2_900, 3_400), 580, Textures.Bookcase2)
    this.bookcase2.setOrigin(0.5, 1)
    this.bookcases.push(this.bookcase2)

    this.laserObstacle = new LaserObstacle(this, 900, 100)
    this.add.existing(this.laserObstacle)

    this.coins = this.physics.add.staticGroup()
    this.spawnCoins()

    this.rocketMouse = new RocketMouse(this, gameWidth * 0.5, gameHeight - 30)
    this.add.existing(this.rocketMouse)

    const mouseBody = this.rocketMouse.body as Phaser.Physics.Arcade.Body
    mouseBody.setCollideWorldBounds(true)
    mouseBody.setVelocityX(200)

    this.cameras.main.startFollow(this.rocketMouse, undefined, undefined, undefined, -200)
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, gameHeight)

    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, gameHeight - 55)
    this.physics.add.overlap(this.laserObstacle, this.rocketMouse, this.handleOverlapLaser, undefined, this)
    this.physics.add.overlap(this.coins, this.rocketMouse, this.handleCollectCoin, undefined, this)

    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '1rem',
      fontFamily: '"Hugmate", sans-serif',
      color: '#fff',
      backgroundColor: '#000',
      padding: {
        left: 15,
        right: 15,
        top: 10,
        bottom: 10,
      },
    }

    this.scoreLabel = this.add.text(10, 10, `Score: ${this.score}`, style)
    this.scoreLabel.setScrollFactor(0)
  }

  public update() {
    this.wrapMouseHole()
    this.wrapWindows()
    this.wrapBookcases()
    this.wrapLaserObstacle()
    this.wrapBackground()
    this.teleportBackwards()
  }

  private wrapMouseHole() {
    const cameraX = this.cameras.main.scrollX
    const rightEdge = cameraX + this.scale.width

    if (this.mouseHole.x + this.mouseHole.width < cameraX) {
      this.mouseHole.x = Phaser.Math.Between(rightEdge + 100, rightEdge + 1_000)
    }
  }

  private wrapWindows() {
    const cameraX = this.cameras.main.scrollX
    const rightEdge = cameraX + this.scale.width
    const gap1 = this.window1.width * 2
    const gap2 = this.window2.width

    if (this.window1.x + gap1 < cameraX) {
      this.window1.x = Phaser.Math.Between(rightEdge + gap1, rightEdge + gap1 + 800)
      const overlap = this.bookcases.some((bookcase) => Math.abs(this.window1.x - bookcase.x) <= this.window1.width)
      this.window1.visible = !overlap
    }

    if (this.window2.x + gap2 < cameraX) {
      this.window2.x = Phaser.Math.Between(this.window1.x + gap2, this.window1.x + gap2 + 800)
      const overlap = this.bookcases.some((bookcase) => Math.abs(this.window2.x - bookcase.x) <= this.window2.width)
      this.window2.visible = !overlap
    }
  }

  private wrapBookcases() {
    const cameraX = this.cameras.main.scrollX
    const rightEdge = cameraX + this.scale.width
    const gap1 = this.bookcase1.width * 2
    const gap2 = this.bookcase2.width

    if (this.bookcase1.x + gap1 < cameraX) {
      this.bookcase1.x = Phaser.Math.Between(rightEdge + gap1, rightEdge + gap1 + 800)
      const overlap = this.windows.some((window) => Math.abs(this.bookcase1.x - window.x) <= window.width)
      this.bookcase1.visible = !overlap
    }

    if (this.bookcase2.x + gap2 < cameraX) {
      this.bookcase2.x = Phaser.Math.Between(this.bookcase1.x + gap2, this.bookcase1.x + gap2 + 800)
      const overlap = this.windows.some((window) => Math.abs(this.bookcase2.x - window.x) <= window.width)
      this.bookcase2.visible = !overlap
    }
  }

  private wrapLaserObstacle() {
    const cameraX = this.cameras.main.scrollX
    const rightEdge = cameraX + this.scale.width

    const laserBody = this.laserObstacle.body as Phaser.Physics.Arcade.StaticBody
    const laserWidth = laserBody.width

    if (this.laserObstacle.x + laserWidth < cameraX) {
      this.laserObstacle.x = Phaser.Math.Between(rightEdge + laserWidth, rightEdge + laserWidth + 1_000)
      this.laserObstacle.y = Phaser.Math.Between(0, 300)
      laserBody.position.x = this.laserObstacle.x + laserBody.offset.x
      laserBody.position.y = this.laserObstacle.y
    }
  }

  private wrapBackground() {
    this.background.setTilePosition(this.cameras.main.scrollX)
  }

  private teleportBackwards() {
    const cameraX = this.cameras.main.scrollX
    const maxX = 2_380

    if (cameraX > maxX) {
      this.rocketMouse.x -= maxX
      this.mouseHole.x -= maxX

      this.windows.forEach((window) => {
        window.x -= maxX
      })

      this.bookcases.forEach((bookcase) => {
        bookcase.x -= maxX
      })

      this.laserObstacle.x -= maxX

      const laserBody = this.laserObstacle.body as Phaser.Physics.Arcade.StaticBody
      laserBody.x -= maxX

      this.spawnCoins()

      this.coins.children.each((child) => {
        const coin = child as Phaser.Physics.Arcade.Sprite
        if (!coin.active) return
        coin.x -= maxX
        const coinBody = coin.body as Phaser.Physics.Arcade.StaticBody
        coinBody.updateFromGameObject()
      })
    }
  }

  private handleOverlapLaser() {
    this.rocketMouse.kill()
  }

  private handleCollectCoin(_: Phaser.GameObjects.GameObject, obj: Phaser.GameObjects.GameObject) {
    if (this.rocketMouse.mouseState !== MouseState.Running) return

    const coin = obj as Phaser.Physics.Arcade.Sprite
    coin.body.enable = false
    this.coins.killAndHide(coin)

    this.score++
    this.scoreLabel.text = `Score: ${this.score}`

    this.sound.play(Sounds.Coin, { volume: 0.5 })
  }

  private spawnCoins() {
    this.coins.children.each((child) => {
      const coin = child as Phaser.Physics.Arcade.Sprite
      this.coins.killAndHide(coin)
      coin.body.enable = false
    })

    const cameraX = this.cameras.main.scrollX
    const rightEdge = cameraX + this.scale.width
    const numCoins = Phaser.Math.Between(1, 20)

    let x = rightEdge + 100

    for (let i = 0; i < numCoins; ++i) {
      const y = Phaser.Math.Between(100, this.scale.height - 100)
      const coin = this.coins.get(x, y, Textures.Coin) as Phaser.Physics.Arcade.Sprite

      coin.setVisible(true)
      coin.setActive(true)

      const coinBody = coin.body as Phaser.Physics.Arcade.StaticBody
      coinBody.setCircle(coinBody.width * 0.5)
      coinBody.enable = true
      coinBody.updateFromGameObject()

      x += coin.width * 1.5
    }
  }
}
