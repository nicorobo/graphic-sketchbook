import type { Vec2, Vec3 } from '../matrix-utils'
import type { IsoModel } from './IsoModel'
import type { RenderVoxel } from './types'

const depthSort = (a: Vec3, b: Vec3) => {
  return a.x + a.y + a.z - (b.x + b.y + b.z)
}

export class IsoScene {
  models: IsoModel[] = []

  constructor(
    public gridSize: number,
    public animateBuild: boolean = false,
    public animationSpeed: number = 1,
  ) {}

  add(...models: IsoModel[]) {
    this.models.push(...models)
  }

  draw(
    ctx: CanvasRenderingContext2D,
    canvasSize: Vec2 = { x: 0, y: 0 },
    time: number = 0,
  ) {
    const all: RenderVoxel[] = []

    for (const m of this.models) {
      m.update(time)
      // m.buildIfDirty()
      all.push(...m.getWorldVoxels())
    }

    all.sort((a, b) => depthSort(a.worldPos, b.worldPos))
    const numberToDraw = this.animateBuild
      ? (time * this.animationSpeed) % all.length
      : all.length
    for (let i = 0; i < numberToDraw; i++) {
      const v = all[i]!
      v.voxel.draw(ctx, canvasSize, v.modelPos, this.gridSize)
    }
    // for (const v of all)
    // v.voxel.draw(ctx, canvasSize, v.modelPos, this.gridSize)
  }
}
