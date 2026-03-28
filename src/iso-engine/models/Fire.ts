import { vec3, type Vec3 } from '../../matrix-utils'
import { getHSLColorSet, getUniformColorSet } from '../colors'
import { IsoModel } from '../IsoModel'
import { IsoVoxel } from '../IsoVoxel'

const COLORS = {
  wall: getHSLColorSet(300, 20),
  floor: getUniformColorSet('white'),
  fire: getUniformColorSet('rgba(62, 118, 209, 0.9)'),
  bright: getUniformColorSet('rgba(250, 255, 93, 0.4)'),
}

export class Fire extends IsoModel {
  constructor(
    position: Vec3,
    public size: number = 5,
  ) {
    super(position)
    this.build()
  }
  build() {
    const size = 1 / this.size
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        for (let k = 0; k < this.size; k++) {
          this.add(
            new IsoVoxel(
              vec3(size * i, size * j, size * k),
              vec3(size),
              COLORS.fire,
              'fire',
            ),
          )
        }
      }
    }
  }

  override update(time: number) {
    if (time % 50 === 0) {
      for (const v of this.groups.get('fire') ?? []) {
        if (Math.random() < 0.4) {
          v.colors = COLORS.bright
        } else {
          v.colors = COLORS.fire
        }
      }
    }
  }
}
