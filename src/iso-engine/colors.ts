export type IsoColors = { x: string; y: string; z: string }

export const getHSLColorSet = (
  hue: number = 0,
  saturation: number = 0,
): IsoColors => ({
  x: `hsl(${hue}, ${saturation}%, 50%)`,
  y: `hsl(${hue}, ${saturation}%, 25%)`,
  z: `hsl(${hue}, ${saturation}%, 75%)`,
})

export const getUniformColorSet = (color: string): IsoColors => ({
  x: color,
  y: color,
  z: color,
})
