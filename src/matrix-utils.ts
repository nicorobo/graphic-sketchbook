export type Vec3 = { x: number; y: number; z: number }
export type Vec2 = { x: number; y: number }

export const vec3 = (x: number, y?: number, z?: number): Vec3 => ({
  x,
  y: y ?? x,
  z: z ?? y ?? x,
})
export const vec2 = (x: number, y?: number): Vec2 => ({ x, y: y ?? x })

export const add2 = (v1: Vec2, v2: Vec2) => {
  return vec2(v1.x + v2.x, v1.y + v2.y)
}

export const add3 = (v1: Vec3, v2: Vec3) => {
  return vec3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
}

export const distance = (v1: Vec2, v2: Vec2) => {
  return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2))
}
export function rotateZ(p: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)

  return {
    x: p.x * c - p.y * s,
    y: p.x * s + p.y * c,
    z: p.z,
  }
}

export function rotateX(p: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)

  return {
    x: p.x,
    y: p.y * c - p.z * s,
    z: p.y * s + p.z * c,
  }
}

export function rotateY(p: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)

  return {
    x: p.x * c + p.z * s,
    y: p.y,
    z: -p.x * s + p.z * c,
  }
}

export function rotateLocal(p: Vec3, r: Vec3): Vec3 {
  let v = p
  v = rotateX(v, r.x)
  v = rotateY(v, r.y)
  v = rotateZ(v, r.z)
  return v
}
