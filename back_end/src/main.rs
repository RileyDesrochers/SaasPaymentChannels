#[allow(dead_code)]
use num_bigint::BigUint;
use std::collections::HashMap;
use std::alloc;
use cap::Cap;
//use std::env;

#[global_allocator]
static ALLOCATOR: Cap<alloc::System> = Cap::new(alloc::System, usize::max_value());

//low level functions--------------------

fn print_cube(cube: Vec<Vec<Vec<u8>>>){
    println!("|{} {} {}|", cube[0][0][0], cube[0][0][1], cube[0][0][2]);
    println!("|{} {} {}|", cube[0][1][0], cube[0][1][1], cube[0][1][2]);
    println!("|{} {} {}|", cube[0][2][0], cube[0][2][1], cube[0][2][2]);
    println!("|{} {} {}|{} {} {}|{} {} {}|{} {} {}|", cube[1][0][0], cube[1][0][1], cube[1][0][2], cube[2][0][0], cube[2][0][1], cube[2][0][2], cube[3][0][0], cube[3][0][1], cube[3][0][2], cube[4][0][0], cube[4][0][1], cube[4][0][2]);
    println!("|{} {} {}|{} {} {}|{} {} {}|{} {} {}|", cube[1][1][0], cube[1][1][1], cube[1][1][2], cube[2][1][0], cube[2][1][1], cube[2][1][2], cube[3][1][0], cube[3][1][1], cube[3][1][2], cube[4][1][0], cube[4][1][1], cube[4][1][2]);
    println!("|{} {} {}|{} {} {}|{} {} {}|{} {} {}|", cube[1][2][0], cube[1][2][1], cube[1][2][2], cube[2][2][0], cube[2][2][1], cube[2][2][2], cube[3][2][0], cube[3][2][1], cube[3][2][2], cube[4][2][0], cube[4][2][1], cube[4][2][2]);
    println!("|{} {} {}|", cube[5][0][0], cube[5][0][1], cube[5][0][2]);
    println!("|{} {} {}|", cube[5][1][0], cube[5][1][1], cube[5][1][2]);
    println!("|{} {} {}|", cube[5][2][0], cube[5][2][1], cube[5][2][2]);
    println!("----------------------------------------");
}

fn cube_to_big(cube: Vec<Vec<Vec<u8>>>) -> BigUint {
    let mut bi: BigUint = BigUint::new(vec![0]);
    let mut p: BigUint = BigUint::new(vec![1]);
    //let mul: BigUint = BigUint::new(vec![6]);
    for n in 0..6 {
        for m in 0..3 {
            for o in 0..3 {
                bi = bi + p.clone() * cube[n][m][o];
                p = p * BigUint::new(vec![6]);
            }
        }
    }
    return bi
}

fn rev(v: Vec<u8>) -> Vec<u8> {
    return vec![v[2], v[1], v[0]];
}

fn insert_row(mut face: Vec<Vec<u8>>, row: Vec<u8>, r: usize) -> Vec<Vec<u8>> {
    face[r] = row; 
    return face;
}

fn get_column(face: &Vec<Vec<u8>>, c: usize) -> Vec<u8> {
    return vec![face[0][c], face[1][c], face[2][c]];
}

fn insert_column(mut face: Vec<Vec<u8>>, col: Vec<u8>, c: usize) -> Vec<Vec<u8>> {
    face[0][c] = col[0];
    face[1][c] = col[1];
    face[2][c] = col[2];
    return face;
}

fn rotate_face_clockwise(face: &Vec<Vec<u8>>) -> Vec<Vec<u8>> {  
    return vec![vec![face[2][0], face[1][0], face[0][0]], vec![face[2][1], face[1][1], face[0][1]], vec![face[2][2], face[1][2], face[0][2]]]
}

//single use---------------

fn get_solid_face(c: u8) -> Vec<Vec<u8>>{
    return vec![
        vec![c, c, c],
        vec![c, c, c],
        vec![c, c, c]
    ]
}

fn get_solved_cube(cube: Vec<Vec<Vec<u8>>>) -> Vec<Vec<Vec<u8>>> {//zero one two three four five
    let (_three, four, five): (u8, u8, u8);
    (_three, four, five) = (cube[3][2][2], cube[4][2][0], cube[5][2][0]);
    let mut cub = vec![cube[0][1][1], cube[1][1][1], cube[2][1][1], cube[3][1][1], cube[4][1][1], cube[5][1][1]];
    if cub[5] != five {
        cub = vec![cub[1], cub[5], cub[2], cub[0], cub[4], cub[3]];
        if cub[5] != five {
            cub = vec![cub[1], cub[5], cub[2], cub[0], cub[4], cub[3]];
            if cub[5] != five {
                cub = vec![cub[1], cub[5], cub[2], cub[0], cub[4], cub[3]];
                if cub[5] != five {
                    cub = vec![cub[1], cub[5], cub[2], cub[0], cub[4], cub[3]];
                    cub = vec![cub[0], cub[2], cub[3], cub[4], cub[1], cub[5]];
                    cub = vec![cub[1], cub[5], cub[2], cub[0], cub[4], cub[3]];
                    if cub[5] != five {
                        cub = vec![cub[1], cub[5], cub[2], cub[0], cub[4], cub[3]];
                        cub = vec![cub[1], cub[5], cub[2], cub[0], cub[4], cub[3]];
                    }
                }
            }
        }
    }
    if cub[4] != four {
        cub = vec![cub[0], cub[2], cub[3], cub[4], cub[1], cub[5]];
        if cub[4] != four {
            cub = vec![cub[0], cub[2], cub[3], cub[4], cub[1], cub[5]];
            if cub[4] != four {
                cub = vec![cub[0], cub[2], cub[3], cub[4], cub[1], cub[5]];
            }
        }
    }
    return vec![get_solid_face(cub[0]), get_solid_face(cub[1]), get_solid_face(cub[2]), get_solid_face(cub[3]), get_solid_face(cub[4]), get_solid_face(cub[5])];
}

//mid level functions---------------

fn move_top(cube: &Vec<Vec<Vec<u8>>>, t: u8) -> Vec<Vec<Vec<u8>>> {
    let mut cpy: Vec<Vec<Vec<u8>>> = vec![
        rotate_face_clockwise(&cube[0]),
        insert_row(cube[1].clone(), cube[2][0].clone(), 0),
        insert_row(cube[2].clone(), cube[3][0].clone(), 0),
        insert_row(cube[3].clone(), cube[4][0].clone(), 0),
        insert_row(cube[4].clone(), cube[1][0].clone(), 0),
        cube[5].clone()
    ];
    if t != 0 {
        (cpy[1], cpy[2], cpy[3], cpy[4]) = (
            insert_row(cpy[1].clone(), cpy[2][1].clone(), 1),
            insert_row(cpy[2].clone(), cpy[3][1].clone(), 1),
            insert_row(cpy[3].clone(), cpy[4][1].clone(), 1),
            insert_row(cpy[4].clone(), cpy[1][1].clone(), 1),
        );
    }
    return cpy;
}

fn move_front(cube: &Vec<Vec<Vec<u8>>>, t: u8) -> Vec<Vec<Vec<u8>>> {
    let mut cpy: Vec<Vec<Vec<u8>>> = vec![
        insert_row(cube[0].clone(), rev(get_column(&cube[4], 2)), 2),
        rotate_face_clockwise(&cube[1]),
        insert_column(cube[2].clone(), cube[0][2].clone(), 0),
        cube[3].clone(),
        insert_column(cube[4].clone(), cube[5][0].clone(), 2),
        insert_row(cube[5].clone(), rev(get_column(&cube[2], 0)), 0),
    ];
    if t != 0 {
        (cpy[0], cpy[2], cpy[5], cpy[4]) = (
            insert_row(cpy[0].clone(), rev(get_column(&cpy[4], 1)), 1),
            insert_column(cpy[2].clone(), cpy[0][1].clone(), 1),
            insert_row(cpy[5].clone(), rev(get_column(&cpy[2], 1)), 1),
            insert_column(cpy[4].clone(), cpy[5][1].clone(), 1),
        );
    }
    return cpy;
}

fn move_side(cube: &Vec<Vec<Vec<u8>>>, t: u8) -> Vec<Vec<Vec<u8>>> {
    let mut cpy: Vec<Vec<Vec<u8>>> = vec![
        insert_column(cube[0].clone(), get_column(&cube[1], 2), 2),
        insert_column(cube[1].clone(), get_column(&cube[5], 2), 2),
        rotate_face_clockwise(&cube[2]),
        insert_column(cube[3].clone(), rev(get_column(&cube[0], 2)), 0),
        cube[4].clone(),
        insert_column(cube[5].clone(), rev(get_column(&cube[3], 0)), 2),
    ];
    if t != 0 {
        (cpy[0], cpy[3], cpy[5], cpy[1]) = (
            insert_column(cpy[0].clone(), get_column(&cpy[1], 1), 1),
            insert_column(cpy[3].clone(), rev(get_column(&cpy[0], 1)), 1),
            insert_column(cpy[5].clone(), rev(get_column(&cpy[3], 1)), 1),
            insert_column(cpy[1].clone(), get_column(&cpy[5], 1), 1),
        );
    }
    return cpy;
}

fn single_move(cube: Vec<Vec<Vec<u8>>>, mv: u8) -> Vec<Vec<Vec<u8>>> {
    match mv {
        0 => return move_top(&cube, 0),
        1 => return move_top(&cube, 1),
        2 => return move_front(&cube, 0),
        3 => return move_front(&cube, 1),
        4 => return move_side(&cube, 0),
        5 => return move_side(&cube, 1),
        _ => return cube,
    }
}

//high level functions

fn all_moves(cube: Vec<Vec<Vec<u8>>>) -> Vec<Vec<Vec<Vec<u8>>>>{
    let mut tmp = vec![single_move(cube.clone(), 0), single_move(cube.clone(), 1), single_move(cube.clone(), 2), single_move(cube.clone(), 3), single_move(cube.clone(), 4), single_move(cube.clone(), 5)];
    tmp.append(&mut vec![single_move(tmp[0].clone(), 0), single_move(tmp[1].clone(), 1), single_move(tmp[2].clone(), 2), single_move(tmp[3].clone(), 3), single_move(tmp[4].clone(), 4), single_move(tmp[5].clone(), 5)]);
    tmp.append(&mut vec![single_move(tmp[6].clone(), 0), single_move(tmp[7].clone(), 1), single_move(tmp[8].clone(), 2), single_move(tmp[9].clone(), 3), single_move(tmp[10].clone(), 4), single_move(tmp[11].clone(), 5)]);
    return tmp;
}

fn states_from_sol(cube: Vec<Vec<Vec<u8>>>) -> HashMap<BigUint, Vec<u8>> {
    let mut sol = HashMap::new();
    sol.insert(cube_to_big(cube.clone()), vec![]);
    //sol[cubeToBig(s)] = [];
    let mut arra: Vec<Vec<Vec<Vec<u8>>>> = vec![cube];
    //for(let n=0;n<1000000;n++){
    for n in 0..100000 {
        if arra.len() <= n {
            return sol;
        }
        let cur = sol[&cube_to_big(arra[n].clone())].clone();
        //println!("{:?}", cur.clone());
        let mvs = all_moves(arra[n].clone());
        /*for n in mvs {
            print_cube(n);
        }*/
        //let l = _statesFromSol(arra[n], cur);
        for m in 0..mvs.len() {
            let key = cube_to_big(mvs[m].clone()).clone();
            if !sol.contains_key(&key) {
                //let mv: Vec<u8> = vec![m.try_into().unwrap()];
                sol.insert(key, vec![vec![m.try_into().unwrap()], cur.clone()].concat());
                if cur.len() < 2 {
                    arra.push(mvs[m].clone());
                }
                //println!("{:?}", vec![mv, cur.clone()].concat());
                
            }
        }

        /*if(n%10000 === 0)(
            console.log(n, arra.length)
        )*/
    }
    println!("this is bad");
    return sol;
}

fn main(){
    ALLOCATOR.set_limit(4 *1024 * 1024 * 1024).unwrap();
    //env::set_var("RUST_BACKTRACE", "1");
    let cube: Vec<Vec<Vec<u8>>> = vec![
        vec![
            vec![2,0,2], 
            vec![5,5,3], 
            vec![1,5,1]
        ],vec![
            vec![4,0,0], 
            vec![3,1,2], 
            vec![2,1,5]
        ],vec![
            vec![3,4,4], 
            vec![4,4,0], 
            vec![4,2,5]
        ],vec![
            vec![3,1,3], 
            vec![2,2,2], 
            vec![2,3,5]
        ],vec![
            vec![0,4,3], 
            vec![5,0,0], 
            vec![1,1,0]
        ],vec![
            vec![5,5,1], 
            vec![4,3,3], 
            vec![0,1,4]
        ]
    ];
    print_cube(single_move(cube.clone(), 5));
    return;
    let sol: HashMap<BigUint, Vec<u8>> = states_from_sol(get_solved_cube(cube.clone()));
    /*for (n, m) in sol {
        println!("{} {:?}", n, m);
    }*/
    //println!("{}", sol.len());

    let mut sta: HashMap<BigUint, Vec<u8>> = HashMap::new();
    let mut arra: Vec<Vec<Vec<Vec<u8>>>> = vec![cube.clone()];
    sta.insert(cube_to_big(cube.clone()), vec![]);
    for n in 0..1000000 {
        if arra.len() <= n {
            return;
        }
        let cur = sta[&cube_to_big(arra[n].clone())].clone();
        let mvs = all_moves(arra[n].clone());
        for m in 0..mvs.len() {
            let key = cube_to_big(mvs[m].clone());
            if !sta.contains_key(&key) {
                //sta[key] = cur.concat(m)
                sta.insert(key.clone(), vec![cur.clone(), vec![m.try_into().unwrap()]].concat());
                //if(typeof (sol[key]) !== 'undefined'){
                if sol.contains_key(&key) {
                    println!("{:?}", vec![sta[&key].clone(), sol[&key].clone()].concat());
                    print_cube(mvs[m].clone());
                    //console.log("SOLVED IN ", sol[key].length + sta[key].length, " MOVES")
                    //console.log(key)
                    //console.log(sol[key])
                    //checkPerm(tmp[m])
                    //console.log(sta[key].concat(sol[key]))
                    //printSol(sta[key][1].concat(sol[key][1]))
                    return;
                }
                if cur.len() < 3 {
                    arra.push(mvs[m].clone());
                }/*else{
                    _sol([[tmp[m], sta[key]]], 2)
                    //arn.push([tmp[m], sta[key]])
                }*/
                //arra.push(tmp[m])
            }
        }
        /*if(n%100 === 0)(
            console.log(n, arra.length)
        )*/
    }
    //println!("{}", cube_to_big(get_solved_cube(cube.clone())));
    //println!("{}", cube_to_big(cube.clone()));
    //let mut cu = cube.clone();
    //cu[0] = rotateFaceClockwise(cu[0].clone(), 2);
    //let x = all_moves(cube.clone());
    /*for n in x {
        print_cube(n);
    }*/
    //print_cube(single_move(cube.clone(), 5))

    //print_cube(get_solved_cube(cube));
}
