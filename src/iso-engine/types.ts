import type { Vec2, Vec3 } from '../matrix-utils'
import type { IsoVoxel } from './IsoVoxel'
export type RenderVoxel = {
  voxel: IsoVoxel
  worldPos: Vec3
  modelPos: Vec3
}
