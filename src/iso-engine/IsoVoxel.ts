import { vec2, vec3, type Vec2, type Vec3 } from '../matrix-utils'
import { getHSLColorSet } from './colors'
import { CUBE, FACES, isoProject } from './geometry'

const defaultColors = getHSLColorSet(200, 100)
const snap = (n: number) => Math.round(n) + 0.5 // Remove + 0.5 if using even stroke width

export class IsoVoxel {
  constructor(
    public position = vec3(0),
    public size = vec3(10),
    public colors = defaultColors,
    public group = '',
  ) {}

  getScreenVertices(canvasSize: Vec2, offset: Vec3, gridSize: number) {
    const { x: px, y: py, z: pz } = this.position
    const { x: w, y: d, z: h } = this.size

    return CUBE.map(([cx, cy, cz]) => {
      const p = isoProject(
        px * gridSize + offset.x * gridSize + cx * w * gridSize,
        py * gridSize + offset.y * gridSize + cy * d * gridSize,
        pz * gridSize + offset.z * gridSize + cz * h * gridSize,
      )
      return vec2(snap(canvasSize.x / 2 + p.x), snap(canvasSize.y / 2 + p.y))
    })
  }

  getWorldPosition(modelPos: Vec3): Vec3 {
    return {
      x: this.position.x + modelPos.x,
      y: this.position.y + modelPos.y,
      z: this.position.z + modelPos.z,
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    canvasSize: Vec2 = { x: 0, y: 0 },
    offset: Vec3 = { x: 0, y: 0, z: 0 },
    gridSize: number = 10,
    options: {
      showStroke: boolean
      showFill: boolean
      strokeStyle: string
      strokeWidth: number
    } = {
      showFill: true,
      showStroke: true,
      strokeStyle: 'rgba(0, 0, 0, 0.5)',
      strokeWidth: 1,
    },
  ) {
    const vertices = this.getScreenVertices(canvasSize, offset, gridSize)
    FACES.forEach(({ indices, colorKey }) => {
      ctx.beginPath()
      indices.forEach((vi, j) => {
        const v = vertices[vi]!
        if (j === 0) ctx.moveTo(v.x, v.y)
        else ctx.lineTo(v.x, v.y)
        if (j === indices.length - 1) ctx.closePath()
      })

      if (options.showFill) {
        ctx.fillStyle = this.colors[colorKey]
        ctx.fill()
      }

      if (options.showStroke) {
        ctx.lineJoin = 'round'
        ctx.miterLimit = 1
        ctx.lineWidth = options.strokeWidth
        ctx.strokeStyle = options.strokeStyle
        ctx.stroke()
      }

      // ctx.font = '24px monospace'
      // vertices.forEach((v, i) => {
      //   ctx.fillStyle = 'white'
      //   ctx.fillText(i + '', v.x, v.y)
      // })
    })
  }
}
