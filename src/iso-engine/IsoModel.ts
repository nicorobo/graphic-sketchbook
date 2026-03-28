import { add3, vec3, type Vec3 } from '../matrix-utils'
import type { IsoVoxel } from './IsoVoxel'
import type { RenderVoxel } from './types'

export const DEFAULT = '__default'
export abstract class IsoModel {
  groups: Map<string, IsoVoxel[]> = new Map()
  // dirty = true

  constructor(public position: Vec3) {}

  getWorldVoxels(): RenderVoxel[] {
    const out: RenderVoxel[] = []
    for (const group of this.groups.values()) {
      for (const v of group) {
        const worldPos = add3(v.getWorldPosition(this.position), vec3(0))
        // const worldPos = add3(v.getWorldPosition(this.position), v.size)
        out.push({
          voxel: v,
          worldPos,
          modelPos: this.position,
        })
      }
    }
    return out
  }

  protected abstract build(): void
  update(time: number): void {}
  // buildIfDirty() {
  //   if (this.dirty) {
  //     this.groups.clear()
  //     this.build()
  //     this.dirty = false
  //   }
  // }

  add(v: IsoVoxel) {
    const key = v.group ?? DEFAULT
    if (!this.groups.has(key)) this.groups.set(key, [])
    this.groups.get(key)!.push(v)
  }
}
