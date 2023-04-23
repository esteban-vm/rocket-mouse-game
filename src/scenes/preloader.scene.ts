import Phaser from 'phaser'
import { Animations, Scenes, Sounds, Textures } from '@/constants'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(Scenes.Preloader)
  }

  public preload() {
    this.load.image([
      { key: Textures.Background, url: '/house/bg_repeat_340x640.png' },
      { key: Textures.Bookcase1, url: '/house/object_bookcase1.png' },
      { key: Textures.Bookcase2, url: '/house/object_bookcase2.png' },
      { key: Textures.Coin, url: '/house/object_coin.png' },
      { key: Textures.LaserEnd, url: '/house/object_laser_end.png' },
      { key: Textures.LaserMiddle, url: '/house/object_laser.png' },
      { key: Textures.MouseHole, url: '/house/object_mousehole.png' },
      { key: Textures.Window1, url: '/house/object_window1.png' },
      { key: Textures.Window2, url: '/house/object_window2.png' },
    ])

    this.load.audio([{ key: Sounds.Coin, url: '/sounds/glass_005.mp3' }])

    this.load.atlas({
      key: Textures.RocketMouse,
      textureURL: '/characters/rocket-mouse.png',
      atlasURL: '/characters/rocket-mouse.json',
    })
  }

  public create() {
    this.anims.create({
      key: Animations.RocketMouseRun,
      frames: this.anims.generateFrameNames(Textures.RocketMouse, {
        start: 1,
        end: 4,
        prefix: 'rocketmouse_run',
        zeroPad: 2,
        suffix: '.png',
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: Animations.RocketFlamesOn,
      frames: this.anims.generateFrameNames(Textures.RocketMouse, {
        start: 1,
        end: 2,
        prefix: 'flame',
        suffix: '.png',
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: Animations.RocketMouseFall,
      frames: [{ key: Textures.RocketMouse, frame: 'rocketmouse_fall01.png' }],
    })

    this.anims.create({
      key: Animations.RocketMouseFly,
      frames: [{ key: Textures.RocketMouse, frame: 'rocketmouse_fly01.png' }],
    })

    this.anims.create({
      key: Animations.RocketMouseDead,
      frames: this.anims.generateFrameNames(Textures.RocketMouse, {
        start: 1,
        end: 2,
        prefix: 'rocketmouse_dead',
        zeroPad: 2,
        suffix: '.png',
      }),
      frameRate: 10,
    })

    this.scene.start(Scenes.Start)
  }
}
