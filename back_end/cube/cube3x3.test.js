const { moveSide, moveFront, moveTop, _moveSide, _moveFront, _moveTop, cubeToBig, printCube, copyCube, moves, decodeMove, reverseMove } = require('./cube3x3.js')

let d = [
    [
        [2,0,2],
        [5,5,3],
        [1,5,1]
    ],[
        [4,0,0],
        [3,1,2],
        [2,1,5]
    ],[
        [3,4,4],
        [4,4,0],
        [4,2,5]
    ],[
        [3,1,3],
        [2,2,2],
        [2,3,5]
    ],[
        [0,4,3],
        [5,0,0],
        [1,1,0]
    ],[
        [5,5,1],
        [4,3,3],
        [0,1,4]
    ],
]

let t = [
    [
        [1,5,2],
        [5,5,0],
        [1,3,2]
    ],[
        [3,4,4],
        [3,1,2],
        [2,1,5]
    ],[
        [3,1,3],
        [4,4,0],
        [4,2,5]
    ],[
        [0,4,3],
        [2,2,2],
        [2,3,5]
    ],[
        [4,0,0],
        [5,0,0],
        [1,1,0]
    ],[
        [5,5,1],
        [4,3,3],
        [0,1,4]
    ],
]

let tm = [
    [
        [2,0,2],
        [5,5,3],
        [1,5,1]
    ],[
        [4,0,0],
        [4,4,0],
        [2,1,5]
    ],[
        [3,4,4],
        [2,2,2],
        [4,2,5]
    ],[
        [3,1,3],
        [5,0,0],
        [2,3,5]
    ],[
        [0,4,3],
        [3,1,2],
        [1,1,0]
    ],[
        [5,5,1],
        [4,3,3],
        [0,1,4]
    ],
]

let f = [
    [
        [2,0,2],
        [5,5,3],
        [0,0,3]
    ],[
        [2,3,4],
        [1,1,0],
        [5,2,0]
    ],[
        [1,4,4],
        [5,4,0],
        [1,2,5]
    ],[
        [3,1,3],
        [2,2,2],
        [2,3,5]
    ],[
        [0,4,5],
        [5,0,5],
        [1,1,1]
    ],[
        [4,4,3],
        [4,3,3],
        [0,1,4]
    ],
]

let fm = [
    [
        [2,0,2],
        [1,0,4],
        [1,5,1]
    ],[
        [4,0,0],
        [3,1,2],
        [2,1,5]
    ],[
        [3,5,4],
        [4,5,0],
        [4,3,5]
    ],[
        [3,1,3],
        [2,2,2],
        [2,3,5]
    ],[
        [0,4,3],
        [5,3,0],
        [1,3,0]
    ],[
        [5,5,1],
        [2,4,4],
        [0,1,4]
    ],
]

let s = [
    [
        [2,0,0],
        [5,5,2],
        [1,5,5]
    ],[
        [4,0,1],
        [3,1,3],
        [2,1,4]
    ],[
        [4,4,3],
        [2,4,4],
        [5,0,4]
    ],[
        [1,1,3],
        [3,2,2],
        [2,3,5]
    ],[
        [0,4,3],
        [5,0,0],
        [1,1,0]
    ],[
        [5,5,2],
        [4,3,2],
        [0,1,3]
    ],
]

let sm = [
    [
        [2,0,2],
        [5,1,3],
        [1,1,1]
    ],[
        [4,5,0],
        [3,3,2],
        [2,1,5]
    ],[
        [3,4,4],
        [4,4,0],
        [4,2,5]
    ],[
        [3,5,3],
        [2,5,2],
        [2,0,5]
    ],[
        [0,4,3],
        [5,0,0],
        [1,1,0]
    ],[
        [5,3,1],
        [4,2,3],
        [0,1,4]
    ],
]

let sol = [
    [
        [4,4,4],
        [4,4,4],
        [4,4,4]
    ],[
        [3,3,3],
        [3,3,3],
        [3,3,3]
    ],[
        [2,2,2],
        [2,2,2],
        [2,2,2]
    ],[
        [5,5,5],
        [5,5,5],
        [5,5,5]
    ],[
        [1,1,1],
        [1,1,1],
        [1,1,1]
    ],[
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ]
]

test("Rotate top", () => {
    let cube = copyCube(d);
    expect(cubeToBig(moveTop(cube, 0))).toBe(cubeToBig(t));
});

test("Rotate mid around top", () => {
    let cube = copyCube(d);
    expect(cubeToBig(_moveTop(cube))).toBe(cubeToBig(tm));
});

test("Rotate front", () => {
    let cube = copyCube(d);
    expect(cubeToBig(moveFront(cube, 0))).toBe(cubeToBig(f));
});

test("Rotate mid around front", () => {
    let cube = copyCube(d);
    expect(cubeToBig(_moveFront(cube))).toBe(cubeToBig(fm));
});

test("Rotate side", () => {
    let cube = copyCube(d);
    expect(cubeToBig(moveSide(cube, 0))).toBe(cubeToBig(s));
});

test("Rotate mid around side", () => {
    let cube = copyCube(d);
    expect(cubeToBig(_moveSide(cube))).toBe(cubeToBig(sm));
});

test("memory falure", () => {
    let cube = copyCube(d);
    let tmp1 = copyCube(t);
    let tmp2 = copyCube(f);
    let tmp3 = copyCube(s);
    expect(cubeToBig(moveTop(cube, 1))).toBe(cubeToBig(_moveTop(tmp1)));
    cube = copyCube(d);
    expect(cubeToBig(moveFront(cube, 1))).toBe(cubeToBig(_moveFront(tmp2)));
    cube = copyCube(d);
    expect(cubeToBig(moveSide(cube, 1))).toBe(cubeToBig(_moveSide(tmp3)));
});

test("reverse move", () => {
    for(let n=0;n<18;n++){
        let m = [0, 0];
        let times = [0, 0];
        [m[0], times[0]] = decodeMove(n);
        [m[1], times[1]] = decodeMove(reverseMove(n));
        //console.log(reverseMove(n));
        expect(m[0]).toBe(m[1]);
        if(times[0] === 1){
            expect(times[1]).toBe(3);
        }else if(times[0] === 2){
            expect(times[1]).toBe(2);
        }else if(times[0] === 3){
            expect(times[1]).toBe(1);
        }else{
            throw new Error("Something went badly wrong!");
        }
    }
});

test("move then reverse move", () => {
    let cube = copyCube(d);
    let start = cubeToBig(cube);

    for(let n=0;n<18;n++){
        let tmp = moves(cube, n)
        tmp = moves(tmp, reverseMove(n))
        expect(start).toBe(cubeToBig(tmp));
    }
});

test("test solution", () => {
    let m = [0, 9,  0, 10, 14, 10, 2, 16,  7,  4, 12];
    let cube = copyCube(d);

    for(let n=0;n<m.length;n++){
        cube = moves(cube, m[n]);
    }
    printCube(cube)
});

