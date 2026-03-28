import { Vec2 } from '../src/vector'
import { getCanvas } from '../src/utils'
import Stats from 'stats.js'
import GUI from 'lil-gui'
const gui = new GUI()

var stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

const width = 1000
const height = 1000
const [canvas, ctx] = getCanvas('canvas', width, height)

const rand = (min: number, max: number) => Math.random() * (max - min) + min
const randomLocation = () => new Vec2(rand(0, width), rand(0, height))

const config = {
  flockSize: 1000,
  boidSize: 10,
  perceptionRadius: 100,
  perceptionFoV: Math.PI * 0.5,
  maxSpeed: 2,
  maxForce: 0.005,
  alignmentWeight: 1,
  cohesionWeight: 1,
  separationWeight: 1,
  showSenseField: true,
  showDirection: false,
}

// --- Flock settings ---
const flockFolder = gui.addFolder('Flock')
flockFolder.add(config, 'flockSize', 1, 5000, 1)
flockFolder.add(config, 'boidSize', 1, 20, 1)
flockFolder.add(config, 'perceptionRadius', 1, 200, 1)
flockFolder.add(config, 'perceptionFoV', 0, 2 * Math.PI, 0.1)

// --- Motion settings ---
const motionFolder = gui.addFolder('Motion')
motionFolder.add(config, 'maxSpeed', 0.1, 10, 0.1)
motionFolder.add(config, 'maxForce', 0.0001, 0.05, 0.0001)

// --- Behavior weights ---
const behaviorFolder = gui.addFolder('Behavior')
behaviorFolder.add(config, 'alignmentWeight', 0, 5, 0.1)
behaviorFolder.add(config, 'cohesionWeight', 0, 5, 0.1)
behaviorFolder.add(config, 'separationWeight', 0, 5, 0.1)

// --- Debug toggles ---
const debugFolder = gui.addFolder('Debug')
debugFolder.add(config, 'showSenseField')
debugFolder.add(config, 'showDirection')

gui.close()

class Body2D {
  constructor(
    public position = new Vec2(),
    public velocity = new Vec2(),
    public acceleration = new Vec2()
  ) {}

  wrapEdge(width: number, height: number) {
    const { x, y } = this.position
    if (x < 0) this.position.x = width
    else if (x > width) this.position.x = 0
    if (y < 0) this.position.y = height
    else if (y > height) this.position.y = 0
  }

  update() {
    this.velocity.add(this.acceleration).lim(config.maxSpeed)
    this.position.add(this.velocity)
    this.acceleration.mult(0)
  }

  show(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.position
    ctx.fillStyle = 'white'
    ctx.fillRect(
      x - config.boidSize / 2,
      y - config.boidSize / 2,
      config.boidSize,
      config.boidSize
    )
  }
}

class Boid2D extends Body2D {
  neighborSensed = false

  align = new Vec2()
  coh = new Vec2()
  sep = new Vec2()

  constructor(
    override position = new Vec2(),
    override velocity = new Vec2(),
    override acceleration = new Vec2()
  ) {
    super(position, velocity, acceleration)
  }
  // align(flockmates: Boid2D[]) {
  //   const steer = flockmates.reduce((v, cur) => v.add(cur.velocity), new Vec2())
  //   return steer
  //     .div(flockmates.length)
  //     .setMag(config.maxSpeed)
  //     .sub(this.velocity)
  //     .lim(config.maxForce)
  // }

  // cohesion(flockmates: Boid2D[]) {
  //   const steer = flockmates.reduce((v, cur) => v.add(cur.position), new Vec2())
  //   return steer
  //     .div(flockmates.length)
  //     .sub(this.position)
  //     .setMag(config.maxSpeed)
  //     .sub(this.velocity)
  //     .lim(config.maxForce)
  // }

  // separation(flockmates: Boid2D[]) {
  //   const steer = new Vec2()
  //   for (let other of flockmates) {
  //     const d = this.position.dist(other.position)
  //     if (d > 0) {
  //       const dif = new Vec2(this.position.x, this.position.y)
  //       dif.sub(other.position).div(d)
  //       steer.add(dif)
  //     }
  //   }
  //   return steer
  //     .div(flockmates.length)
  //     .setMag(config.maxSpeed)
  //     .sub(this.velocity)
  //     .lim(config.maxForce)
  // }

  flock(boids: Boid2D[]) {
    let count = 0
    this.align.mult(0)
    this.coh.mult(0)
    this.sep.mult(0)
    const r2 = config.perceptionRadius ** 2
    const cosHalf = Math.cos(config.perceptionFoV / 2)
    const cosHalfSq = cosHalf * cosHalf
    const { x, y } = this.position
    const { x: vx, y: vy } = this.velocity
    const invMag = 1 / Math.sqrt(vx * vx + vy * vy)
    const fx = vx * invMag
    const fy = vy * invMag

    for (let other of boids) {
      if (other === this) continue
      const dx = other.position.x - x
      const dy = other.position.y - y
      const distSq = dx * dx + dy * dy
      const dot = dx * fx + dy * fy
      let visible = false
      if (cosHalf >= 0) {
        // FoV ≤ 180°  → fast squared test
        visible = dot * dot >= distSq * cosHalfSq && distSq <= r2
      } else {
        // FoV > 180° → must preserve sign
        visible = dot >= Math.sqrt(distSq) * cosHalf && distSq <= r2
      }
      if (!visible) continue

      count++

      this.align.add(other.velocity)
      this.coh.add(other.position)

      const d = Math.hypot(dx, dy)
      if (d > 0) {
        this.sep.x -= dx / d
        this.sep.y -= dy / d
      }
    }

    if (count === 0) return

    this.align
      .div(count)
      .setMag(config.maxSpeed)
      .sub(this.velocity)
      .lim(config.maxForce)
    this.coh
      .div(count)
      .sub(this.position)
      .setMag(config.maxSpeed)
      .sub(this.velocity)
      .lim(config.maxForce)
    this.sep
      .div(count)
      .setMag(config.maxSpeed)
      .sub(this.velocity)
      .lim(config.maxForce)

    this.acceleration
      .add(this.align.mult(config.alignmentWeight))
      .add(this.coh.mult(config.cohesionWeight))
      .add(this.sep.mult(config.separationWeight))
  }

  override show(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.position
    if (config.showSenseField || config.showDirection) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(this.velocity.angle())
      if (config.showDirection) {
        ctx.beginPath()
        ctx.strokeStyle = 'white'
        ctx.moveTo(0, 0)
        ctx.lineTo(config.perceptionRadius, 0)
        ctx.stroke()
      }
      if (config.showSenseField) {
        ctx.beginPath()
        ctx.fillStyle = 'rgba(173, 39, 164, 0.3)'

        ctx.moveTo(0, 0)
        ctx.arc(
          0,
          0,
          config.perceptionRadius,
          -config.perceptionFoV / 2,
          config.perceptionFoV / 2
        )
        ctx.fill()
      }

      ctx.restore()
    }
    super.show(ctx)
  }
}

const neighborOrientations = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 0],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const
class Boids2D {
  boids: Boid2D[] = []
  constructor(public count: number) {
    for (let i = 0; i < count; i++) {
      this.boids.push(new Boid2D(randomLocation(), Vec2.random()))
    }
  }
  // Instead of adding the boid to a point on the grid, we add it to all 9 points it will be relevant for.
  getGrid(perceptionRadius: number) {
    const grid: { [key: string]: Boid2D[] } = {}
    for (let boid of this.boids) {
      const x = Math.floor(boid.position.x / perceptionRadius)
      const y = Math.floor(boid.position.y / perceptionRadius)
      const key = (x << 16) | y
      if (grid[key]) {
        grid[key].push(boid)
      } else {
        grid[key] = [boid]
      }
    }
    return grid
  }
  show(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    perceptionRadius: number
  ) {
    const grid = this.getGrid(perceptionRadius)
    for (let boid of this.boids) {
      const x = Math.floor(boid.position.x / perceptionRadius)
      const y = Math.floor(boid.position.y / perceptionRadius)
      const flockmates = neighborOrientations.reduce((prev, cur) => {
        const neighbors = grid[((x + cur[0]) << 16) | (y + cur[1])] ?? []
        prev.push(...neighbors)
        return prev
      }, [] as Boid2D[])
      boid.wrapEdge(width, height)
      boid.flock(flockmates)
      boid.update()
      boid.show(ctx)
    }
  }
}

const bb = new Boids2D(config.flockSize)

let t = 0

function render() {
  stats.begin()
  ctx.clearRect(0, 0, width, height)
  bb.show(ctx, width, height, config.perceptionRadius)
  t++
  stats.end()
  requestAnimationFrame(render)
}
render()
