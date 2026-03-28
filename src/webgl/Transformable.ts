import { mat4 } from "gl-matrix"

function makeReactiveVec3(vec: Vec3, onChange: () => void): Vec3 {
    return new Proxy(vec, {
        set(target, prop, value) {
            target[prop as any] = value;
            onChange();
            return true;
        }
    });
}

type Vec3 = [number, number, number]
export type Transform = { position: Vec3, rotation: Vec3, scale: Vec3 }
export type TransformArgs = Partial<Transform>
export const defaultTransform: Transform = {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1]
}

export class Transformable {
    position: Vec3
    rotation: Vec3
    scale: Vec3
    #transformMatrix: mat4 = mat4.create()
    #dirty = true
    constructor(transform?: TransformArgs) {
        const t: Transform = { ...defaultTransform, ...(transform ?? {}) }
        const invalidate = () => { this.#dirty = true }
        this.position = makeReactiveVec3(t.position, invalidate)
        this.rotation = makeReactiveVec3(t.rotation, invalidate)
        this.scale = makeReactiveVec3(t.scale, invalidate)
    }

    getTransformMatrix(): mat4 {
        if (this.#dirty) {
            this.#recalculate()
            this.#dirty = false
        }
        return this.#transformMatrix
    }

    #recalculate() {
        const matrix = mat4.create()
        mat4.translate(matrix, matrix, this.position)
        mat4.rotateX(matrix, matrix, this.rotation[0])
        mat4.rotateY(matrix, matrix, this.rotation[1])
        mat4.rotateZ(matrix, matrix, this.rotation[2])
        mat4.scale(matrix, matrix, this.scale)
        this.#transformMatrix = matrix
    }
}