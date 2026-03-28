export class Vec2 {
  constructor(public x: number = 0, public y: number = 0) {}

  private op(v: Vec2 | number, op: (a: number, b: number) => number) {
    if (v instanceof Vec2) {
      this.x = op(this.x, v.x)
      this.y = op(this.y, v.y)
    } else {
      this.x = op(this.x, v)
      this.y = op(this.y, v)
    }
    return this
  }
  add(v: Vec2 | number) {
    return this.op(v, (a, b) => a + b)
  }
  sub(v: Vec2 | number) {
    return this.op(v, (a, b) => a - b)
  }
  mult(v: Vec2 | number) {
    return this.op(v, (a, b) => a * b)
  }
  div(v: Vec2 | number) {
    return this.op(v, (a, b) => a / b)
  }
  dist(v: Vec2) {
    return Math.hypot(v.x - this.x, v.y - this.y)
  }
  within(v: Vec2, dist: number) {
    const dx = v.x - this.x
    const dy = v.y - this.y
    return dx * dx + dy * dy < dist * dist
  }
  mag() {
    return Math.hypot(this.x, this.y)
  }
  norm() {
    const mag = this.mag()
    if (mag !== 0) {
      this.div(mag)
    }
    return this
  }
  setMag(mag: number) {
    return this.norm().mult(mag)
  }
  lim(max: number) {
    const mag = this.mag()
    if (mag > max) {
      this.norm().mult(max)
    }
    return this
  }
  angle() {
    return Math.atan2(this.y, this.x)
  }
  static random() {
    const angle = Math.random() * Math.PI * 2
    return new Vec2(Math.sin(angle), Math.cos(angle))
  }
}
