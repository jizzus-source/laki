export class Vector3 {

    static VECTOR_ONE = new Vector3(1, 1, 1);
    static VECTOR_ZERO = new Vector3(0, 0, 0);

    constructor (x, y, z) {
        this.x = x; this.y = y; this.z = z;
    }

    static from (vec) {
        return new Vector3(vec.x, vec.y, vec.z);
    }

    times (num) {
        return new Vector3(this.x * num, this.y * num, this.z * num);
    }

    minus (vec) {
        return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }

    magnitude () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

}