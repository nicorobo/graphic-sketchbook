import { mat4 } from "gl-matrix"
import { Transformable, type TransformArgs } from "./Transformable"

export class Camera extends Transformable {
    projection: mat4 = mat4.create()
    constructor(transform?: TransformArgs) {
        super(transform)
    }

    getProjectionMatrix() {
        const f = mat4.create()
        mat4.multiply(f, this.projection, this.getTransformMatrix())
        return f
    }
}

export class IsoCamera extends Camera {
    constructor() {
        super({ position: [0, 0, -50], rotation: [Math.atan(1 / Math.sqrt(2)), Math.PI / 4, 0] })
        mat4.ortho(this.projection, -10, 10, -10, 10, 0.1, 100)
    }
}