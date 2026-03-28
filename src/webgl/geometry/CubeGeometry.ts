import { vec3, mat4 } from 'gl-matrix'
import { Geometry } from './Geometry'

type Vec3 = [number, number, number]

const buildCubeTransforms = (scale: vec3) => {
  const front = mat4.fromScaling(mat4.create(), scale)
  const back = mat4.fromYRotation(mat4.create(), Math.PI)
  const left = mat4.fromYRotation(mat4.create(), Math.PI * -0.5)
  const right = mat4.fromYRotation(mat4.create(), Math.PI * 0.5)
  const top = mat4.fromXRotation(mat4.create(), Math.PI * -0.5)
  const bottom = mat4.fromXRotation(mat4.create(), Math.PI * 0.5)
  mat4.scale(back, back, scale)
  mat4.scale(left, left, vec3.fromValues(scale[2], scale[1], scale[0]))
  mat4.scale(right, right, vec3.fromValues(scale[2], scale[1], scale[0]))
  mat4.scale(top, top, vec3.fromValues(scale[0], scale[2], scale[1]))
  mat4.scale(bottom, bottom, vec3.fromValues(scale[0], scale[2], scale[1]))
  return [front, back, left, right, top, bottom]
}

const generateFace = (matrix: mat4, n: number = 1, size = 1) => {
  const vertices = []
  const indices = []
  const edgeIndices = []
  const normals = []
  const nml = vec3.fromValues(0, 0, 1)
  vec3.transformMat4(nml, nml, matrix)

  for (let x = 0; x <= n; x++) {
    for (let y = 0; y <= n; y++) {
      const vec = vec3.fromValues(
        (x / n) * size - size / 2,
        (y / n) * size - size / 2,
        size / 2,
      )
      vec3.transformMat4(vec, vec, matrix)
      vertices.push(vec[0], vec[1], vec[2])
      normals.push(nml[0], nml[1], nml[2])
    }
  }

  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      const a = x * (n + 1) + y
      const b = a + 1
      const c = a + (n + 1)
      const d = c + 1
      indices.push(a, b, c)
      indices.push(b, d, c)
      edgeIndices.push(a, b, b, d, d, c, c, a)
    }
  }

  return { vertices, indices, edgeIndices, normals }
}

const generateFaces = (transforms: mat4[], n: number) => {
  const vertices: number[] = []
  const indices: number[] = []
  const normals: number[] = []
  const edgeIndices: number[] = []
  transforms.forEach((matrix, i) => {
    const face = generateFace(matrix, n)
    const offset = i * (n + 1) ** 2
    vertices.push(...face.vertices)
    normals.push(...face.normals)
    indices.push(...face.indices.map((index) => index + offset))
    edgeIndices.push(...face.edgeIndices.map((index) => index + offset))
  })
  return { vertices, indices, edgeIndices, normals }
}

export class CubeGeometry extends Geometry {
  constructor(
    gl: WebGL2RenderingContext,
    scale: Vec3 = [1, 1, 1],
    divisions: number = 1,
  ) {
    const transforms = buildCubeTransforms(scale)
    const { vertices, normals, indices, edgeIndices } = generateFaces(
      transforms,
      divisions,
    )
    super(gl, vertices, normals, indices, edgeIndices)
  }
}
