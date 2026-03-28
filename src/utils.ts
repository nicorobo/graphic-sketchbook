export const getCanvas = (id: string, width: number, height: number) => {
  const canvas = document.getElementById(id)
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw new Error(`Element #${id} not found`)
  }
  canvas.width = width
  canvas.height = height
  canvas.style.width = `${width / 2}px`
  canvas.style.height = `${height / 2}px`
  const ctx = canvas.getContext('2d')

  return [canvas, ctx] as [HTMLCanvasElement, CanvasRenderingContext2D]
}

export const getWebGLCanvas = (id: string, width: number, height: number) => {
  const canvas = document.getElementById(id)
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw new Error(`Element #${id} not found`)
  }
  canvas.width = width
  canvas.height = height
  canvas.style.width = `${width / 2}px`
  canvas.style.height = `${height / 2}px`
  const ctx = canvas.getContext('webgl2')

  return [canvas, ctx] as [HTMLCanvasElement, WebGL2RenderingContext]
}

export const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180
export class Grid<T> {
  values: Array<T>
  constructor(
    public numCols: number,
    public numRows: number,
    setValues: (x: number, y: number) => T,
  ) {
    this.values = new Array<T>(numCols * numRows)
    this.setValues(setValues)
  }
  at(x: number, y: number) {
    return this.values[x + y * this.numCols]
  }
  rowAt(y: number) {
    const startIndex = y * this.numCols
    return this.values.slice(startIndex, startIndex + this.numCols)
  }

  colAt(x: number) {
    const col = []
    for (let y = 0; y < this.numRows; y++) {
      col.push(this.at(x, y))
    }
    return col
  }

  setValue(x: number, y: number, value: T) {
    this.values[x + y * this.numCols] = value
  }

  setValues(
    cb: (x: number, y: number, value: T | undefined, self: Grid<T>) => T,
  ) {
    this.forEach((x, y, value, self) =>
      this.setValue(x, y, cb(x, y, value, self)),
    )
  }

  forEach(cb: (x: number, y: number, value: T, self: Grid<T>) => void) {
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numCols; x++) {
        cb(x, y, this.at(x, y) as T, this)
      }
    }
  }

  forEachRow(cb: (y: number, row: Array<T>, self: Grid<T>) => void) {
    for (let y = 0; y < this.numRows; y++) {
      cb(y, this.rowAt(y), this)
    }
  }
  forEachCol(cb: (x: number, col: Array<T>, self: Grid<T>) => void) {
    for (let x = 0; x < this.numCols; x++) {
      cb(x, this.rowAt(x), this)
    }
  }
  print() {
    this.forEachRow((_, row) => {
      console.log(row)
    })
  }

  toGridXCoord(x: number, max: number) {
    return Math.floor((x / max) * this.numCols)
  }

  toGridYCoord(y: number, max: number) {
    return Math.floor((y / max) * this.numRows)
  }

  fromGridXCoord(x: number, max: number) {
    return (max / this.numCols) * x
  }

  fromGridYCoord(y: number, max: number) {
    return (max / this.numRows) * y
  }
}
