import { mat4 } from "gl-matrix";
import type { Mesh } from "./mesh/Mesh";
import { Transformable } from "./Transformable";

export class Model extends Transformable {
    meshes: Mesh[] = []
    constructor(meshes: Mesh[] = []) {
        super()
        this.meshes = meshes
    }

    addMesh(mesh: Mesh) {
        this.meshes.push(mesh)
    }

    draw(gl: WebGL2RenderingContext, mvp: mat4) {
        const modelMatrix = this.getTransformMatrix()
        const matrix = mat4.create()
        mat4.multiply(matrix, mvp, modelMatrix)

        for (const mesh of this.meshes) {
            mesh.draw(gl, matrix, modelMatrix)
        }
    }
}