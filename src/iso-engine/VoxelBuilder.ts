import { vec2, vec3, type Vec2, type Vec3 } from '../matrix-utils'
import type { IsoColors } from './colors'
import type { IsoModel } from './IsoModel'
import { IsoVoxel } from './IsoVoxel'

interface SharedArgs {
  position?: Vec3
  color?: IsoColors
  group?: string
}

interface BoxShellArgs extends SharedArgs {
  size: Vec3
}
interface PlaneArgs extends SharedArgs {
  size: Vec3
  height: number
}
export class VoxelBuilder {
  static boxShell(model: IsoModel, args: BoxShellArgs) {
    const { position = vec3(0), size, color, group } = args
    const { x, y, z } = position
    for (let j = 0; j < size.z; j++) {
      for (let i = 0; i < size.x; i++) {
        model.add(
          new IsoVoxel(vec3(i + x, 0 + y, j + z), vec3(1), color, group),
        )
        model.add(
          new IsoVoxel(
            vec3(i + x, size.y - 1 + y, j + z),
            vec3(1),
            color,
            group,
          ),
        )
      }
      for (let i = 0; i < size.y; i++) {
        model.add(
          new IsoVoxel(vec3(0 + x, i + y, j + z), vec3(1), color, group),
        )
        model.add(
          new IsoVoxel(
            vec3(size.x - 1 + x, i + y, j + z),
            vec3(1),
            color,
            group,
          ),
        )
      }
    }
  }
  static plane(model: IsoModel, args: PlaneArgs) {
    const { position = vec3(0), size, height = 1, color, group } = args
    const { x, y, z } = position
    for (let i = 0; i < size.x; i++) {
      for (let j = 0; j < size.y; j++) {
        model.add(
          new IsoVoxel(
            vec3(i + x, j + y, height + z),
            vec3(1, 1, size.z),
            color,
            group,
          ),
        )
      }
    }
  }
}
