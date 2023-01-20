var assert = require('assert');
const { deflate } = require('zlib');

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
                bi += p * BigInt(cube[n][m][o]);
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

function allMoves(cube){
    let tmp = [move(cube, 0), move(cube, 1), move(cube, 2), move(cube, 3), move(cube, 4), move(cube, 5)]
    tmp = tmp.concat([move(tmp[0], 0), move(tmp[1], 1), move(tmp[2], 2), move(tmp[3], 3), move(tmp[4], 4), move(tmp[5], 5)])
    tmp = tmp.concat([move(tmp[6], 0), move(tmp[7], 1), move(tmp[8], 2), move(tmp[9], 3), move(tmp[10], 4), move(tmp[11], 5)])
    //cube = copyCube(cube)
    //let o = allOrientations(cube)
    //let s = []
    /*for(let n=0;n<o.length;n++){
        s.push(moveAndFix(o[n], 0, 1, cor))
        s.push(moveAndFix(o[n], 0, 2, cor))
        s.push(moveAndFix(o[n], 0, 3, cor))
    }*/
    
    return tmp
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
    let fa = [getRow(cube[2], 1), getRow(cube[3], 1), getRow(cube[4], 1), getRow(cube[1], 1)]
    cube[1] = insertRow(cube[1], fa[0], 1)
    cube[2] = insertRow(cube[2], fa[1], 1)
    cube[3] = insertRow(cube[3], fa[2], 1)
    cube[4] = insertRow(cube[4], fa[3], 1)
    return cube
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

function _moveFront(cube){
    let fa = [getColumn(cube[4], 1).reverse(), getRow(cube[0], 1), getColumn(cube[2], 1).reverse(), getRow(cube[5], 1)]
    cube[0] = insertRow(cube[0], fa[0], 1)
    cube[2] = insertColumn(cube[2], fa[1], 1)
    cube[5] = insertRow(cube[5], fa[2], 1)
    cube[4] = insertColumn(cube[4], fa[3], 1)
    return cube
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

function _moveSide(cube){
    let fa = [getColumn(cube[1], 1), getColumn(cube[0], 1).reverse(), getColumn(cube[3], 1).reverse(), getColumn(cube[5], 1)]
    cube[0] = insertColumn(cube[0], fa[0], 1)
    cube[3] = insertColumn(cube[3], fa[1], 1)
    cube[5] = insertColumn(cube[5], fa[2], 1)
    cube[1] = insertColumn(cube[1], fa[3], 1)
    return cube
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

function move(cube, move){
    cube = copyCube(cube)
    switch(move){
        case 0:
            return moveTop(cube, 0);
        case 1:
            return moveTop(cube, 1);
        case 2:
            return moveFront(cube, 0);
        case 3:
            return moveFront(cube, 1);
        case 4:
            return moveSide(cube, 0);
        case 5:
            return moveSide(cube, 1);
        default:
            throw new Error("Something went badly wrong!");
    }
}

function moves(cube, _move){
    let m;
    let times;
    [m, times] = decodeMove(_move);
    for(let n=0;n<times;n++){
        cube = move(cube, m);
    }
    return cube;
}

function decodeMove(move){
    return [move%6, Math.floor(move/6)+1];
}

function reverseMove(move){
    return (6*(2-Math.floor(move/6)))+move%6;
}

function getCorner(cube){
    return [cube[0][2][2], cube[1][0][2], cube[2][0][0]]
}
function getCorners(cube){
    return [
        [cube[0][2][0], cube[1][0][0], cube[4][0][2]].sort(),
        [cube[0][2][2], cube[1][0][2], cube[2][0][0]].sort(),
        [cube[0][0][2], cube[2][0][2], cube[3][0][0]].sort(),
        [cube[0][0][0], cube[3][0][2], cube[4][0][0]].sort(),
        [cube[1][2][0], cube[4][2][2], cube[5][0][0]].sort(),
        [cube[1][2][2], cube[2][2][0], cube[5][0][2]].sort(),
        [cube[2][2][2], cube[3][2][0], cube[5][2][2]].sort(),
        [cube[3][2][2], cube[4][2][0], cube[5][2][0]].sort()
    ]

}

function checkCorner(cube, corner){
    let c = getCorner(cube);
    if(corner[0] === c[0] && corner[1] === c[1] && corner[2] === c[2]){
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
        let tmp2 = cubeToBig(tmp)
        if(typeof (states[cubeToBig(tmp)]) === 'undefined'){
            states[cubeToBig(tmp)] = tmp
            arr.push(tmp)
        }
        tmp = rotateCubeUp(arr[n])
        tmp2 = cubeToBig(tmp)
        if(typeof (states[cubeToBig(tmp)]) === 'undefined'){
            states[cubeToBig(tmp)] = tmp
            arr.push(tmp)
        }
    }
}

function getRow(face, r){
    return face[r];
}

function insertRow(face, row, r){
    face[r] = row; 
    return face;
}

function getColumn(face, c){
    return [face[0][c], face[1][c], face[2][c]];
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
]*/

let s = [
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

function printMove(move){
    let t = Math.floor(move/6) + 1
    let m = move%6
    switch(m){
        case 0:
            console.log("spin the top face clockwise ", t, " times")
            return;
        case 1:
            console.log("spin the top and middle clockwise ", t, " times")
            return;
        case 2:
            console.log("spin the front face clockwise ", t, " times")
            return;
        case 3:
            console.log("spin the front and middle clockwise ", t, " times")
            return;
        case 4:
            console.log("spin the side face clockwise ", t, " times")
            return;
        case 5:
            console.log("spin the side and middle clockwise ", t, " times")
            return;
        default:
            throw new Error("Something went badly wrong!");
    }
}

function printSol(moves){
    //cube = copyCube(d)
    for(let n=0;n<moves.length;n++){
        /*for(let m=0;m<t;m++){
            cube = move(cube, m)
        }*/
        //printCube(cube)
        printMove(moves[n]);
    }
}

let sol = {}

function checkPerm(cube){
    printCube(cube)
    let m = sol[cubeToBig(cube)][1];
    //let start = cubeToBig(cube);
    let tmp = copyCube(cube)
    for(let n=0;n<m.length;n++){
        tmp = moves(tmp, m[n])
    }
    if(cubeToBig(s) !== cubeToBig(tmp)){
        console.log('cube error')
        printCube(cube)
        printCube(tmp)
    }
}

function _statesFromSol(cube, cur){
    let tmp = allMoves(cube)
    let tmparr = [];
    for(let m=0;m<tmp.length;m++){
        let ths = cubeToBig(tmp[m]);
        if(typeof (sol[ths]) === 'undefined'){
            sol[ths] = [reverseMove(m)].concat(cur)
            tmparr.push(tmp[m])
        }
    }
    return tmparr;
}

function statesFromSol(){
    sol[cubeToBig(s)] = [];
    let arra = [s]

    for(let n=0;n<1000000;n++){
        if(n >= arra.length){
            return
        }
        let cur = sol[cubeToBig(arra[n])];
        let l = _statesFromSol(arra[n], cur);
        if(cur.length < 4){
            for(let m=0;m<l.length;m++){
                arra.push(l[m])
            }
        }
        if(n%10000 === 0)(
            console.log(n, arra.length)
        )
    }
}

function _sol(ar){

}

function main(){

    statesFromSol()
    let sta = {}
    validatedata(d)
    sta[cubeToBig(d)] = [0, []]

    let arra = [d]

    for(let n=0;n<1000000;n++){
        if(n >= arra.length){
            return
        }
        let cur = sta[cubeToBig(arra[n])];
        let tmp = allMoves(arra[n]) 
        for(let m=0;m<tmp.length;m++){
            //validatedata(tmp[m])
            let ths = cubeToBig(tmp[m]);
            if(typeof (sta[ths]) === 'undefined'){
                sta[ths] = [cur[0] + 1, cur[1].concat(m)]
                if(typeof (sol[ths]) !== 'undefined'){
                    console.log("SOLVED IN ", sol[ths].length + sta[ths][0], " MOVES")
                    console.log(ths)
                    //console.log(sol[ths])
                    //checkPerm(tmp[m])
                    console.log(sta[ths][1].concat(sol[ths]))
                    //printSol(sta[ths][1].concat(sol[ths][1]))
                    return;
                }
                if(cur[0] < 4){
                    /*if(tmp[m][3][2][2] !== 5 || tmp[m][4][2][0] !== 1 || tmp[m][5][2][0] !== 0){
                        throw new Error("Something went badly wrong!");
                    }*/
                    arra.push(tmp[m])
                }
                //arra.push(tmp[m])
                /*if(last !== cur[0]){
                    last = cur[0]
                    console.log(last)
                }*/
            }
        }
        if(n%10000 === 0)(
            console.log(n, arra.length)
        )
    }
}
main()
//console.log(getCorners(d))
//console.log([s[3][2][2], s[4][2][0], s[5][2][0]])

module.exports = { moveSide, moveFront, moveTop, _moveSide, _moveFront, _moveTop, cubeToBig, printCube, copyCube, moves, decodeMove, reverseMove }