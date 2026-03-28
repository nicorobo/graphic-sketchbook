const dx = 1
const dy = 0.5
// const ISO_ANGLE = Math.PI / 6
// const dx = Math.cos(ISO_ANGLE)
// const dy = Math.sin(ISO_ANGLE)
// const dx = 2
// const dy = 1

export const isoProject = (x: number, y: number, z: number) => {
  return {
    x: (x - y) * dx,
    y: (x + y) * dy - z,
  }
}

export const CUBE = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 1],
] as const

export const FACES = [
  { name: 'right', indices: [1, 2, 6, 5], colorKey: 'x' },
  { name: 'left', indices: [2, 3, 7, 6], colorKey: 'y' },
  { name: 'top', indices: [4, 5, 6, 7], colorKey: 'z' },
] as const
