import { vec3, type Vec3 } from '../../matrix-utils'
import { noise3D } from '../../simplex'
import { getHSLColorSet, getUniformColorSet } from '../colors'
import { IsoModel } from '../IsoModel'
import { VoxelBuilder } from '../VoxelBuilder'

const noise = noise3D()

const COLORS = {
  wall: getHSLColorSet(300, 20),
  floor: getUniformColorSet('white'),
  water: getUniformColorSet('rgba(123, 123, 241, 0.66)'),
}

const noiseAt = (x: number, y: number, z: number, scale: number) =>
  (noise(x * scale, y * scale, z) + 1) / 2

export class Basin extends IsoModel {
  thickness = 0.5
  constructor(
    position: Vec3,
    public size: Vec3,
  ) {
    super(position)
    this.build()
  }
  build() {
    this.buildWall(this.size)
    this.buildWater(this.size)
  }
  buildWall(size: Vec3) {
    VoxelBuilder.boxShell(this, {
      size,
      color: COLORS.wall,
      group: 'wall',
    })
    VoxelBuilder.plane(this, {
      size: vec3(size.x - 2, size.y - 2, 0.1),
      position: vec3(1, 1, 0),
      height: 0,
      color: COLORS.floor,
      group: 'floor',
    })
  }
  buildWater(size: Vec3) {
    VoxelBuilder.plane(this, {
      size: vec3(size.x - 2, size.y - 2, 1),
      position: vec3(1, 1, 0),
      height: this.size.z - 0.5,
      color: COLORS.water,
      group: 'water',
    })
  }

  override update(time: number) {
    const water = this.groups.get('water') ?? []
    for (const voxel of water) {
      if (voxel.group === 'water') {
        const offset =
          noiseAt(voxel.position.x, voxel.position.y, time * 0.01, 0.5) * 0.2
        voxel.size.z = 0.3 + offset
      }
    }
  }
}
