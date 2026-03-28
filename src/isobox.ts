import { rotateX, rotateZ, rotateLocal, vec3 } from './matrix-utils'
import type { Vec3, Vec2 } from './matrix-utils'

type Camera = {
  rotate: Vec3
  pan: Vec3
}

const ISO_Z = Math.PI / 4 // 45°
const ISO_X = Math.atan(Math.sqrt(2)) // ≈ 35.264°

export const ISO_CAMERA: Camera = {
  rotate: vec3(ISO_X, 0, ISO_Z),
  pan: vec3(0, 0, 0),
}

const BOX_FACES = [
  { name: 'top', indices: [0, 1, 2, 3] },
  { name: 'bottom', indices: [4, 5, 6, 7] },

  { name: 'left', indices: [0, 3, 7, 4] },
  { name: 'right', indices: [1, 2, 6, 5] },

  { name: 'front', indices: [3, 2, 6, 7] },
  { name: 'back', indices: [0, 1, 5, 4] },
]

function faceDepth(face: number[], camVerts: Vec3[]) {
  let sum = 0
  for (const i of face) sum += camVerts[i]!.z
  return sum / face.length
}

function toWorld(p: Vec3, position: Vec3): Vec3 {
  return vec3(p.x + position.x, p.y + position.y, p.z + position.z)
}

function worldToCamera(p: Vec3, camera: Camera): Vec3 {
  return rotateX(rotateZ(p, camera.rotate.z), camera.rotate.x)
}

function project(p: Vec3): Vec2 {
  return { x: p.x, y: p.y }
}

export class IsoBox {
  constructor(
    public position = { x: 0, y: 0, z: 0 },
    public size = { x: 100, y: 200, z: 300 },
    public rotation = { x: 0, y: 0, z: 0 },
    public fill = 'rgba(255, 255, 255, 0.5)'
  ) {}

  getLocalVertices(): Vec3[] {
    const { x: w, y: d, z: h } = this.size

    return [
      vec3(0, 0, 0),
      vec3(w, 0, 0),
      vec3(w, d, 0),
      vec3(0, d, 0),

      vec3(0, 0, h),
      vec3(w, 0, h),
      vec3(w, d, h),
      vec3(0, d, h),
    ]
  }
  getVertices(): Vec3[] {
    const localVerts = this.getLocalVertices()

    const worldVerts = localVerts.map((v) =>
      toWorld(rotateLocal(v, this.rotation), this.position)
    )
    return worldVerts
  }

  draw(ctx: CanvasRenderingContext2D, camera: Camera = ISO_CAMERA) {
    const worldVerts = this.getVertices()
    const camVerts = worldVerts.map((v) => worldToCamera(v, camera))
    const screenVerts = camVerts.map(project)

    const faces = BOX_FACES.map((f) => ({
      ...f,
      depth: faceDepth(f.indices, camVerts),
    }))

    faces.sort((a, b) => a.depth - b.depth)

    for (let i = 0; i < faces.length; i++) {
      const face = faces[i]!
      ctx.beginPath()
      for (let j = 0; j < face.indices.length; j++) {
        const index = face.indices[j]!
        if (j === 0) ctx.moveTo(screenVerts[index]!.x, screenVerts[index]!.y)
        ctx.lineTo(screenVerts[index]!.x, screenVerts[index]!.y)
      }
      ctx.strokeStyle = 'black'
      ctx.fillStyle = this.fill
      ctx.fill()
      ctx.stroke()
    }
  }
}
