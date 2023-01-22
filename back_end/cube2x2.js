var assert = require('assert');

class cube {
    constructor(data) {
        validatedata(data)
        this.faces = data;
    }

    validatedata(data){
        assert(data.length === 6)
        c = [0, 0, 0, 0, 0, 0];

        for (const face in data) {
            assert(face.length === 3)
            for (const row in face) {
                assert(row.length === 3)
                for (const element in row) {
                    assert(element < 6)
                    switch(element){
                        case 0:
                            c[0]++;
                            break;
                        case 1:
                            c[1]++;
                            break;
                        case 2:
                            c[2]++;
                            break;
                        case 3:
                            c[3]++;
                            break;
                        case 4:
                            c[4]++;
                            break;
                        case 5:
                            c[5]++;
                    }
                }
            }
        }
        for (let n = 0; n < cars.length; n++){
            assert(c[n] === 9)
        }
    }
}