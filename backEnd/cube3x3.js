var assert = require('assert');

function printCube(cube){
    try{
        console.log(cube[0][0])
        console.log(cube[0][1])
        console.log(cube[0][2])
        console.log(cube[1][0], cube[2][0], cube[3][0], cube[4][0])
        console.log(cube[1][1], cube[2][1], cube[3][1], cube[4][1])
        console.log(cube[1][2], cube[2][2], cube[3][2], cube[4][2])
        console.log(cube[5][0])
        console.log(cube[5][1])
        console.log(cube[5][2])
        console.log('-----------------')
    }catch(err){
        console.log('print err', cube)
    }
}

function cubeToBig(cube){
    let bi = BigInt(0);
    let p = BigInt(1);
    for(let n=0;n<6;n++){
        for(let m=0;m<3;m++){
            for(let o=0;o<3;o++){
                bi += p * BigInt(cube[n][m][0]);
                p *= BigInt(6);
            }
        }
    }
    return bi
}

function copyCube(cube){
    let cp = []
    for(let n=0;n<6;n++){
        cp.push(copyFace(cube[n]))
    }
    return cp;
}

function copyFace(face){
    let fc = [[0,0,0], [0,0,0], [0,0,0]]
    for(let m=0;m<3;m++){
        for(let o=0;o<3;o++){
            fc[m][o] = face[m][o];
        }
    }
    return fc;
}


function validatedata(data){
    assert(data.length === 6)
    var c = [0, 0, 0, 0, 0, 0];

    for (let n = 0; n < 6; n++){
        assert(data[n].length === 3)
        for (let m = 0; m < 3; m++){
            assert(data[n][m].length === 3)
            for (let o = 0; o < 3; o++){
                var element = data[n][m][o];
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
    for (let n = 0; n < c.length; n++){
        assert(c[n] === 9)
    }
}

/*
function mirrorface(face){
    let f2 = copyFace(face)
    return [f2[2], f2[1], f2[0]]
}*/

function _rotateFaceClockwise(face){  
    return [[face[2][0], face[1][0], face[0][0]], [face[2][1], face[1][1], face[0][1]], [face[2][2], face[1][2], face[0][2]]]
}

function rotateFaceClockwise(face, n){  
    for (let m = 0; m < n; m++){
        face = _rotateFaceClockwise(face)
    }
    return face
}

function rotateCubeUp(cube){  
    return [copyFace(cube[1]), copyFace(cube[5]), rotateFaceClockwise(cube[2], 1), rotateFaceClockwise(cube[0], 2), rotateFaceClockwise(cube[4], 3), rotateFaceClockwise(cube[3], 2)]
}

function rotateCubeClockwise(cube){  
    return [rotateFaceClockwise(cube[0], 1), copyFace(cube[2]), copyFace(cube[3]), copyFace(cube[4]), copyFace(cube[1]), rotateFaceClockwise(cube[5], 3)]
}

function checkIfSolved(cube){
    for (let n=0;n<6;n++){
        for(let m=0;m<3;m++){
            for(let o=0;o<3;o++){
                if(cube[n][0][0] !== cube[n][m][o]){
                    return false;
                }
            }
        }
    }
    return true;
}

function allOrientations(cube){
    let tmp1 = rotateCubeUp(cube)
    let tmp2 = rotateCubeClockwise(cube)
    let tmp3 = rotateCubeClockwise(tmp2)
    let tmp4 = rotateCubeClockwise(tmp3)
    return [copyCube(cube), tmp1, rotateCubeUp(tmp1), rotateCubeUp(tmp2), rotateCubeUp(tmp3), rotateCubeUp(tmp4)]

}

function allMoves(cube, cor){
    cube = copyCube(cube)
    let o = allOrientations(cube)
    let s = []
    for(let n=0;n<o.length;n++){
        s.push(moveAndFix(o[n], 0, 1, cor))
        s.push(moveAndFix(o[n], 0, 2, cor))
        s.push(moveAndFix(o[n], 0, 3, cor))
    }
    
    return s
}

function moveAndFix(cube, face, n, cor){
    cube = copyCube(cube)
    validatedata(cube)
    let tmp = move(cube, face, n)
    //printCube(tmp)
    let tmp2 = fixCorner(tmp, cor)
    if (typeof tmp2 === 'undefined')
        //validatedata(tmp)
        printCube(rotateCubeClockwise(tmp))
    return tmp2
}

function _moveTop(cube){
    fa = [getRow(cube[2], 1), getRow(cube[3], 1), getRow(cube[4], 1), getRow(cube[1], 1)]
    cube[1] = insertRow(cube[1], fa[0], 1)
    cube[2] = insertRow(cube[2], fa[1], 1)
    cube[3] = insertRow(cube[3], fa[2], 1)
    cube[4] = insertRow(cube[4], fa[3], 1)
}

function moveTop(cube, type){
    let f = cube[0]
    f=_rotateFaceClockwise(f)
    cube[0] = f;
    let fa = [getRow(cube[2], 0), getRow(cube[3], 0), getRow(cube[4], 0), getRow(cube[1], 0)]
    cube[1] = insertRow(cube[1], fa[0], 0)
    cube[2] = insertRow(cube[2], fa[1], 0)
    cube[3] = insertRow(cube[3], fa[2], 0)
    cube[4] = insertRow(cube[4], fa[3], 0)
    if(type != 0){
        cube = _moveTop(cube);
    }
    return cube
}

function _moveFront(cube, type){
    fa = [getColumn(cube[4], 1).reverse(), getRow(cube[0], 1), getColumn(cube[2], 1).reverse(), getRow(cube[5], 1)]
    cube[0] = insertRow(cube[0], fa[0], 1)
    cube[2] = insertColumn(cube[2], fa[1], 1)
    cube[5] = insertRow(cube[5], fa[2], 1)
    cube[4] = insertColumn(cube[4], fa[3], 1)
}

function moveFront(cube, type){
    let f = cube[1]
    f=_rotateFaceClockwise(f)
    cube[1] = f;
    let fa = [getColumn(cube[4], 2).reverse(), getRow(cube[0], 2), getColumn(cube[2], 0).reverse(), getRow(cube[5], 0)]
    cube[0] = insertRow(cube[0], fa[0], 2)
    cube[2] = insertColumn(cube[2], fa[1], 0)
    cube[5] = insertRow(cube[5], fa[2], 0)
    cube[4] = insertColumn(cube[4], fa[3], 2)
    if(type != 0){
        cube = _moveFront(cube);
    }
    return cube
}

function _moveSide(cube, type){
    fa = [getColumn(cube[1], 1), getColumn(cube[0], 1).reverse(), getColumn(cube[3], 1).reverse(), getColumn(cube[5], 1)]
    cube[0] = insertColumn(cube[0], fa[0], 1)
    cube[3] = insertColumn(cube[3], fa[1], 1)
    cube[5] = insertColumn(cube[5], fa[2], 1)
    cube[1] = insertColumn(cube[1], fa[3], 1)
}

function moveSide(cube, type){
    let f = cube[2]
    f=_rotateFaceClockwise(f)
    cube[2] = f;
    let fa = [getColumn(cube[1], 2), getColumn(cube[0], 2).reverse(), getColumn(cube[3], 0).reverse(), getColumn(cube[5], 2)]
    cube[0] = insertColumn(cube[0], fa[0], 2)
    cube[3] = insertColumn(cube[3], fa[1], 0)
    cube[5] = insertColumn(cube[5], fa[2], 2)
    cube[1] = insertColumn(cube[1], fa[3], 2)
    if(type != 0){
        cube = _moveSide(cube);
    }
    return cube
}

function move(cube, move, n){
    cube = copyCube(cube);

    assert(n < 4 && n > 0)
    assert(move < 2 && move < -1)
    if (move === 0){
        let f = cube[0]
        f=rotateFaceClockwise(f, n)
        cube[0] = f;
        let fa = [getRow(cube[1], 0), getRow(cube[2], 0), getRow(cube[3], 0), getRow(cube[4], 0)]
        for (let m = 0; m < n; m++){
            fa = [fa[1], fa[2], fa[3], fa[0]]
        }
        cube[1] = insertRow(cube[1], fa[0], 0)
        cube[2] = insertRow(cube[2], fa[1], 0)
        cube[3] = insertRow(cube[3], fa[2], 0)
        cube[4] = insertRow(cube[4], fa[3], 0)
        //printCube(cube)
    }
    else if(move === 1){
        let f = cube[0]
        f=rotateFaceClockwise(f, n)
        cube[0] = f;
        let fa = [getRow(cube[1], 0), getRow(cube[2], 0), getRow(cube[3], 0), getRow(cube[4], 0)]
        let fa2 = [getRow(cube[1], 1), getRow(cube[2], 1), getRow(cube[3], 1), getRow(cube[4], 1)]
        for (let m = 0; m < n; m++){
            fa = [fa[1], fa[2], fa[3], fa[0]]
            fa2 = [fa2[1], fa2[2], fa2[3], fa2[0]]
        }
        cube[1] = insertRow(insertRow(cube[1], fa[0], 0), fa2[0], 1)
        cube[2] = insertRow(insertRow(cube[2], fa[1], 0), fa2[0], 1)
        cube[3] = insertRow(insertRow(cube[3], fa[2], 0), fa2[0], 1)
        cube[4] = insertRow(insertRow(cube[4], fa[3], 0), fa2[0], 1)
    }else if(move === 2){
        let f = cube[1]
        f=rotateFaceClockwise(f, n)
        cube[1] = f;
        let fa = [getRow(cube[0], 2), getColumn(cube[4], 2).reverse(), getRow(cube[5], 0).reverse(), getColumn(cube[2], 0)]
        for (let m = 0; m < n; m++){
            fa = [fa[1], fa[2], fa[3], fa[0]]
        }
        cube[0] = insertRow(cube[0], fa[0], 3)
        cube[4] = insertRow(cube[4], fa[1], 2)
        cube[5] = insertRow(cube[5], fa[2], 0)
        cube[2] = insertRow(cube[2], fa[3], 0)
    }else if(move === 3){
        let fa = [getRow(cube[1], 0), getRow(cube[2], 0), getRow(cube[3], 0), getRow(cube[4], 0)]
        let fa2 = [getRow(cube[1], 1), getRow(cube[2], 1), getRow(cube[3], 1).reverse(), getRow(cube[4], 1).reverse()]
        for (let m = 0; m < n; m++){
            fa = [fa[1], fa[2], fa[3], fa[0]]
        }
        cube[1] = insertRow(insertRow(cube[1], fa[0], 0), fa2[0], 1)
        cube[2] = insertRow(insertRow(cube[2], fa[1], 0), fa2[0], 1)
        cube[3] = insertRow(insertRow(cube[3], fa[2], 0), fa2[0], 1)
        cube[4] = insertRow(insertRow(cube[4], fa[3], 0), fa2[0], 1)
    }else if(move === 4){
        let fa = [getRow(cube[1], 0), getRow(cube[2], 0), getRow(cube[3], 0), getRow(cube[4], 0)]
        let fa2 = [getRow(cube[1], 1), getRow(cube[2], 1), getRow(cube[3], 1), getRow(cube[4], 1)]
        for (let m = 0; m < n; m++){
            fa = [fa[1], fa[2], fa[3], fa[0]]
            fa2 = [fa2[1], fa2[2], fa2[3], fa2[0]]
        }
        cube[1] = insertRow(insertRow(cube[1], fa[0], 0), fa2[0], 1)
        cube[2] = insertRow(insertRow(cube[2], fa[1], 0), fa2[0], 1)
        cube[3] = insertRow(insertRow(cube[3], fa[2], 0), fa2[0], 1)
        cube[4] = insertRow(insertRow(cube[4], fa[3], 0), fa2[0], 1)
    }else if(move === 5){
        let fa = [getRow(cube[1], 0), getRow(cube[2], 0), getRow(cube[3], 0), getRow(cube[4], 0)]
        let fa2 = [getRow(cube[1], 1), getRow(cube[2], 1), getRow(cube[3], 1), getRow(cube[4], 1)]
        for (let m = 0; m < n; m++){
            fa = [fa[1], fa[2], fa[3], fa[0]]
            fa2 = [fa2[1], fa2[2], fa2[3], fa2[0]]
        }
        cube[1] = insertRow(insertRow(cube[1], fa[0], 0), fa2[0], 1)
        cube[2] = insertRow(insertRow(cube[2], fa[1], 0), fa2[0], 1)
        cube[3] = insertRow(insertRow(cube[3], fa[2], 0), fa2[0], 1)
        cube[4] = insertRow(insertRow(cube[4], fa[3], 0), fa2[0], 1)
    }else{
        throw new Error("Something went badly wrong!");
    }
    try{
        validatedata(cube)
    }catch(err){
        console.log('move error', n)
        printCube(data)

    }
    return cube;
}

function getCorner(cube){
    return [cube[0][2][2], cube[1][0][2], cube[2][0][0]]
}

function checkCorner(cube, corner){
    let c = getCorner(cube);
    if(corner[0] === c[0] && corner[1] === c[1] && corner[2] === c[2]){
        //console.log('--->', c)
        //printCube(cube)
        return true;
    }
    return false;
}

function _fixCorner(cube, corner){
    for(let n=0;n<4;n++){
        if(checkCorner(cube, corner)){
            return [true, cube]
        }
        cube = rotateCubeClockwise(cube)
    }
    return [false, []];
}

function fixCorner(cube, corner){
    cube = copyCube(cube)
    validatedata(cube)
    let states = {}
    states[cubeToBig(cube)] = cube
    let arr = [cube]
    //let t = allOrientations(cube)
    /*for(let n=0;n<t.length;n++){
        states[cubeToBig(t[n])] = t[n]
    }*/
    for(let n=0;n<25;n++){
        /*if(n>=arr.length){
            break
        }*/
        try{
            if(checkCorner(arr[n], corner)){
                return arr[n]
            }
        }catch(err){
            console.log('print err', n, arr.length)

            printCube(cube)
            throw new Error("Something went badly wrong!");
        }
        let tmp = rotateCubeClockwise(arr[n])
        //validatedata(tmp)
        let tmp2 = cubeToBig(tmp)
        if(typeof (states[cubeToBig(tmp)]) === 'undefined'){
            //printCube(tmp)
            states[cubeToBig(tmp)] = tmp
            arr.push(tmp)
        }
        tmp = rotateCubeUp(arr[n])
        //validatedata(tmp)
        tmp2 = cubeToBig(tmp)
        if(typeof (states[cubeToBig(tmp)]) === 'undefined'){
            //printCube(tmp)
            states[cubeToBig(tmp)] = tmp
            arr.push(tmp)
        }
    }
    //console.log(arr)
    //throw new Error("Something went badly wrong!");
    
    /*
    for(let n=0;n<t.length;n++){
        let tmp = _fixCorner(t[n], corner);
        if(tmp[0] === true){
            return tmp[1];
        }
    }*/
}

function getRow(face, r){
    return face[r];
}

function insertRow(face, row, r){
    face[r] = row; 
    return face;
}

function getColumn(face, c){
    return [face[0][c], f[1][c], f[2][c]];
}

function insertColumn(face, col, c){
    face[0][c] = col[0];
    face[1][c] = col[1];
    face[2][c] = col[2];
    return face;
}



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

/*
let e = [
    [
        [4,0,0],
        [3,1,2],
        [2,1,5]
    ],[
        [5,5,1],
        [4,3,3],
        [0,1,4]
    ],[
        [4,4,3],
        [2,4,4],
        [5,0,4]
    ],[
        [1,5,1],
        [3,5,5],
        [2,0,2]
    ],[
        [3,0,0],
        [4,0,1],
        [0,5,1]
    ],[
        [5,3,2],
        [2,2,2],
        [3,1,3]
    ],
]

let s = [
    [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ],[
        [1,1,1],
        [1,1,1],
        [1,1,1]
    ],[
        [2,2,2],
        [2,2,2],
        [2,2,2]
    ],[
        [3,3,3],
        [3,3,3],
        [3,3,3]
    ],[
        [4,4,4],
        [4,4,4],
        [4,4,4]
    ],[
        [5,5,5],
        [5,5,5],
        [5,5,5]
    ],
]*/

let count =0;
function main(){

    let sta = {}
    validatedata(d)
    let cor = getCorner(d)
    sta[cubeToBig(d)] = 0

    let arra = [d]

    for(let n=0;n<50000;n++){
        let tmp = allMoves(arra[n], cor) 
        for(let m=0;m<tmp.length;m++){
            validatedata(tmp[m])
            if(checkIfSolved(tmp[m])){
                console.log("SOLVED IN ", sta[cubeToBig(arra[n])] + 1, " MOVES")
                return
            }
            if(typeof (sta[cubeToBig(tmp[m])]) === 'undefined'){
                sta[cubeToBig(tmp[m])] = sta[cubeToBig(arra[n])] + 1
                arra.push(tmp[m])
                if(count<sta[cubeToBig(tmp[m])]){
                    count = sta[cubeToBig(tmp[m])]
                    console.log(count)
                }
            }
        }
    }
    console.log(arra.length)
}
//main()
validatedata(t)
validatedata(tm)
validatedata(f)
validatedata(fm)
validatedata(s)
validatedata(sm)