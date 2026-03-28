import { vec3, type Vec3 } from '../../matrix-utils'
import { getHSLColorSet, getUniformColorSet } from '../colors'
import { IsoModel } from '../IsoModel'
import { IsoVoxel } from '../IsoVoxel'

const COLORS = {
  wall: getHSLColorSet(300, 20),
  floor: getUniformColorSet('white'),
  water: getUniformColorSet('rgba(123, 123, 241, 0.66)'),
}

export class Vase extends IsoModel {
    thickness = 0.3
  constructor(position: Vec3) {
    super(position)
    this.build()
  }
  build() {
    for (let i = 0; i < 20; i++) {
      const f = Math.abs(Math.sin((Math.PI * 2 / 20) * i))
      console.log(f)
      this.add(
        new IsoVoxel(
          vec3(1-f / 2, 1-f / 2, this.thickness * i),
          vec3(f, f, this.thickness),
          COLORS.water,
        ),
      )
    }
  }

  override update(time: number) {
    // const water = this.groups.get('water') ?? []
    // for (const voxel of water) {
    //   if (voxel.group === 'water') {
    //     const offset =
    //       noiseAt(voxel.position.x, voxel.position.y, time * 0.01, 0.5) * 0.2
    //     voxel.size.z = 0.3 + offset
    //   }
    // }
  }
}
