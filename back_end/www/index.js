import * as wasm from "./sudoku/pkg/sudoku";

let s = [
    new Uint8Array([0, 0, 0, 6, 0, 1, 0, 0, 0]), 
    new Uint8Array([0, 8, 0, 0, 0, 0, 0, 2, 0]),
    new Uint8Array([5, 6, 0, 0, 7, 0, 0, 9, 3]),
    new Uint8Array([9, 0, 0, 0, 0, 0, 0, 0, 7]),
    new Uint8Array([0, 5, 0, 0, 3, 0, 0, 4, 0]),
    new Uint8Array([0, 0, 2, 0, 8, 0, 9, 0, 0]),
    new Uint8Array([2, 0, 0, 0, 0, 0, 0, 0, 9]), 
    new Uint8Array([8, 0, 0, 4, 5, 3, 0, 0, 6]),
    new Uint8Array([0, 7, 0, 0, 0, 0, 0, 3, 0])
];

console.log(s.length);

console.log(wasm.sol(s));
