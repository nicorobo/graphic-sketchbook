import { CubeGeometry } from "../geometry/CubeGeometry";
import type { Geometry } from "../geometry/Geometry";
import { BasicMaterial, Material } from "../Material";
import { Model } from "../Model";
import { Mesh } from "./Mesh";

type Vec3 = [number, number, number]
export class Basin extends Model {
    geo: Geometry
    mat: Material
    constructor(gl: WebGL2RenderingContext, public size: Vec3) {
        super()
        this.geo = new CubeGeometry(gl)
        this.mat = new BasicMaterial(gl)
        this.buildWall()
    }

    buildWall() {
        const { size, geo, mat } = this
        for (let j = 0; j < size[1]; j++) {
            for (let i = 0; i < size[0]; i++) {
                this.addMesh(
                    new Mesh(geo, mat, { position: [i, j, 0] }),
                )
                this.addMesh(
                    new Mesh(geo, mat, { position: [i, j, size[2] - 1] }),
                )
            }
            for (let i = 0; i < size[2]; i++) {
                this.addMesh(
                    new Mesh(geo, mat, { position: [0, j, i] }),
                )
                this.addMesh(
                    new Mesh(geo, mat, { position: [size[0] - 1, j, i] }),
                )
            }
        }
    }
}