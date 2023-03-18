#[allow(dead_code)]
//use num_bigint::BigUint;
//use num_traits::identities;
//use bigint::U256;
use std::collections::HashMap;
//use std::alloc;
//use cap::Cap;
//use std::mem::size_of;
//use queues::*;
//use std::env;

//#[global_allocator]
//static ALLOCATOR: Cap<alloc::System> = Cap::new(alloc::System, usize::max_value());

//low level functions--------------------

fn print_cube(cube: &Vec<Vec<Vec<u8>>>){
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

fn cube_to_big_face(cube: &Vec<Vec<u8>>) -> u32 {
    let mut bi: u32 = 0;
    let mut p: u32 = 1;
    for m in 0..3 {
        for o in 0..3 {
            bi = bi + p * (cube[m][o] as u32);
            p = p * 6;
        }
    }
    return bi
}

fn big_to_cube_face(mut bi: u32) -> Vec<Vec<u8>> {
    let mut cube: Vec<Vec<u8>> = get_solid_face(0);
    for m in 0..3 {
        for o in 0..3 {
            cube[m][o] = (bi%6) as u8;
            bi = bi/6;
        }
    }
    return cube
}


fn cube_to_big(cube: &Vec<Vec<Vec<u8>>>) -> Vec<u32> {
    let mut bi: Vec<u32> = vec![0,0,0,0,0,0];
    for n in 0..6 {
        let mut p: u32 = 1;
        for m in 0..3 {
            for o in 0..3 {
                bi[n] = bi[n] + p * (cube[n][m][o] as u32);
                p = p * 6;
            }
        }
    }
    return bi
}

fn big_to_cube(b: &Vec<u32>) -> Vec<Vec<Vec<u8>>> {
    let mut bi = b.clone();
    let mut cube = vec![get_solid_face(0), get_solid_face(0), get_solid_face(0), get_solid_face(0), get_solid_face(0), get_solid_face(0)];
    for n in 0..6 {
        for m in 0..3 {
            for o in 0..3 {
                cube[n][m][o] = (bi[n]%6) as u8;
                bi[n] = bi[n]/6;
            }
        }
    }
    return cube
}

/*fn cube_to_big(cube: &Vec<Vec<Vec<u8>>>) -> BigUint {
    let mut bi: BigUint = identities::zero();
    let mut q: BigUint = identities::one();
    for n in 0..6 {
        let mut p: u32 = 1;
        let mut tmp: u32 = 0;
        for m in 0..3 {
            for o in 0..3 {
                tmp = tmp + p * (cube[n][m][o] as u32);
                p = p * 6;
                //bi = &bi + (&q * cube[n][m][o]);
                //q = &q * 6u8;
            }
        }
        bi = &bi + (&q * tmp);
        q = &q * 10077696u32;
    }
    return bi
}

fn big_to_cube(b: &BigUint) -> Vec<Vec<Vec<u8>>> {
    let mut bi: BigUint = b.clone();
    let mut cube: Vec<Vec<Vec<u8>>> = vec![get_solid_face(0), get_solid_face(0), get_solid_face(0), get_solid_face(0), get_solid_face(0), get_solid_face(0)];
    //let six_to_nine = BigUint::from(10077696);
    for n in 0..6 {
        let tmp = bi.to_u32_digits();
        if tmp.len() == 0 {
            return cube
        }
        let mut face = tmp[0] % 10077696u32;
        bi = bi / 10077696u32;
        for m in 0..3 {
            for o in 0..3 {
                cube[n][m][o] = (face % 6u32) as u8;
                face = face / 6u32;
            }
        }
    }
    return cube
}*/

/*
fn cube_to_big(cube: &Vec<Vec<Vec<u8>>>) -> U256 {
    let mut bi: U256 = U256::zero();
    let six_to_nine = U256::from(10077696);
    let mut q = U256::one();
    for n in 0..6 {
        let mut p: u32 = 1;
        let mut tmp: u32 = 0;
        for m in 0..3 {
            for o in 0..3 {
                tmp = tmp + p * (cube[n][m][o] as u32);
                p = p * 6;
            }
        }
        bi = bi + q * U256::from(tmp);
        q = q * six_to_nine;
    }
    return bi
}

fn big_to_cube(b: &U256) -> Vec<Vec<Vec<u8>>> {
    let mut bi: U256 = b.clone();
    let mut cube = vec![get_solid_face(0), get_solid_face(0), get_solid_face(0), get_solid_face(0), get_solid_face(0), get_solid_face(0)];
    let six_to_nine = U256::from(10077696);
    for n in 0..6 {
        let mut face = u32::from(bi%six_to_nine);
        bi = bi/six_to_nine;
        for m in 0..3 {
            for o in 0..3 {
                cube[n][m][o] = (face%6) as u8;
                face = face/6;
            }
        }
    }
    return cube
}
*/

fn rev(v: &Vec<u8>) -> Vec<u8> {
    return vec![v[2], v[1], v[0]];
}

fn insert_row(mut face: Vec<Vec<u8>>, row: &Vec<u8>, r: usize) -> Vec<Vec<u8>> {
    face[r] = row.clone(); 
    return face;
}

fn get_column(face: &Vec<Vec<u8>>, c: usize) -> Vec<u8> {
    return vec![face[0][c], face[1][c], face[2][c]];
}

fn insert_column(mut face: Vec<Vec<u8>>, col: &Vec<u8>, c: usize) -> Vec<Vec<u8>> {
    face[0][c] = col[0];
    face[1][c] = col[1];
    face[2][c] = col[2];
    return face;
}

fn rotate_face_clockwise(face: &Vec<Vec<u8>>) -> Vec<Vec<u8>> {  
    return vec![vec![face[2][0], face[1][0], face[0][0]], vec![face[2][1], face[1][1], face[0][1]], vec![face[2][2], face[1][2], face[0][2]]]
}

fn get_solid_face(c: u8) -> Vec<Vec<u8>>{
    return vec![
        vec![c, c, c],
        vec![c, c, c],
        vec![c, c, c]
    ]
}

//single use---------------

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

fn move_top2(c: &mut Vec<u32>) {
    let cube = vec![big_to_cube_face(c[1]), big_to_cube_face(c[2]), big_to_cube_face(c[3]), big_to_cube_face(c[4])];
    *c = vec![
        c[0],
        cube_to_big_face(&insert_row(cube[0].clone(), &cube[1][1], 1)),
        cube_to_big_face(&insert_row(cube[1].clone(), &cube[2][1], 1)),
        cube_to_big_face(&insert_row(cube[2].clone(), &cube[3][1], 1)),
        cube_to_big_face(&insert_row(cube[3].clone(), &cube[0][1], 1)),
        c[5],
    ];
}

fn move_top(c: &mut Vec<u32>) {
    let cube = big_to_cube(c);
    let cpy: Vec<Vec<Vec<u8>>> = vec![
        rotate_face_clockwise(&cube[0]),
        insert_row(cube[1].clone(), &cube[2][0], 0),
        insert_row(cube[2].clone(), &cube[3][0], 0),
        insert_row(cube[3].clone(), &cube[4][0], 0),
        insert_row(cube[4].clone(), &cube[1][0], 0),
        cube[5].clone(),
    ];
    *c = cube_to_big(&cpy);
}

fn move_front2(c: &mut Vec<u32>) {
    let cube = vec![big_to_cube_face(c[0]), big_to_cube_face(c[2]), big_to_cube_face(c[4]), big_to_cube_face(c[5])];
    *c = vec![
        cube_to_big_face(&insert_row(cube[0].clone(), &rev(&get_column(&cube[2], 1)), 1)),
        c[1],
        cube_to_big_face(&insert_column(cube[1].clone(), &cube[0][1], 1)),
        c[3],
        cube_to_big_face(&insert_column(cube[2].clone(), &cube[3][1], 1)),
        cube_to_big_face(&insert_row(cube[3].clone(), &rev(&get_column(&cube[1], 1)), 1)),
    ];
}

fn move_front(c: &mut Vec<u32>) {
    let cube = big_to_cube(c);
    let cpy: Vec<Vec<Vec<u8>>> = vec![
        insert_row(cube[0].clone(), &rev(&get_column(&cube[4], 2)), 2),
        rotate_face_clockwise(&cube[1]),
        insert_column(cube[2].clone(), &cube[0][2], 0),
        cube[3].clone(),
        insert_column(cube[4].clone(), &cube[5][0], 2),
        insert_row(cube[5].clone(), &rev(&get_column(&cube[2], 0)), 0),
    ];
    *c = cube_to_big(&cpy);
}

fn move_side2(c: &mut Vec<u32>) {
    let cube = big_to_cube(c);
    let cpy: Vec<Vec<Vec<u8>>> = vec![
        insert_column(cube[0].clone(), &get_column(&cube[1], 1), 1),
        insert_column(cube[1].clone(), &get_column(&cube[5], 1), 1),
        cube[2].clone(),
        insert_column(cube[3].clone(), &rev(&get_column(&cube[0], 1)), 1),
        cube[4].clone(),
        insert_column(cube[5].clone(), &rev(&get_column(&cube[3], 1)), 1),
    ];
    *c = cube_to_big(&cpy);
}

fn move_side(c: &mut Vec<u32>) {
    let cube = big_to_cube(c);
    let cpy: Vec<Vec<Vec<u8>>> = vec![
        insert_column(cube[0].clone(), &get_column(&cube[1], 2), 2),
        insert_column(cube[1].clone(), &get_column(&cube[5], 2), 2),
        rotate_face_clockwise(&cube[2]),
        insert_column(cube[3].clone(), &rev(&get_column(&cube[0], 2)), 0),
        cube[4].clone(),
        insert_column(cube[5].clone(), &rev(&get_column(&cube[3], 0)), 2),
    ];
    *c = cube_to_big(&cpy);
}

fn single_move(cube: &mut Vec<u32>, mv: u8) {
    match mv {
        0 => move_top(cube),
        1 => move_top2(cube),
        2 => move_front(cube),
        3 => move_front2(cube),
        4 => move_side(cube),
        5 => move_side2(cube),
        _ => return,
    }
    return;
}

//high level functions

fn states_from_sol(sol: &mut HashMap<Vec<u32>, Vec<u8>>, cube: &Vec<Vec<Vec<u8>>>) {
    
    //let mut sol = HashMap::new();
    //sol[cubeToBig(s)] = [];
    let mut arra: Vec<Vec<u32>> = vec![cube_to_big(cube)];
    sol.insert(arra[0].clone(), vec![]);
    for n in 0..10000000 {
        if arra.len() <= n {
            return;
        }
        let cur = sol[&arra[n]].clone();
        for m in 0..6 {
            //let mut bi: Vec<u32> = Vec<u32>::zero();
            let mut key = arra[n].clone();
            for o in 0..3 {
                //mv = single_move(&mv, m);
                single_move(&mut key, m);//cube_to_big(&mv);
                if !sol.contains_key(&key) {
                    sol.insert(key.clone(), vec![vec![(m+(o*6)).try_into().unwrap()], cur.clone()].concat());
                    if cur.len() < 5 {
                        arra.push(key.clone());
                    }
                }
            }
        }
    }
    println!("this is bad");
    //return sol;
}

fn main(){
    //ALLOCATOR.set_limit(8 *1024 * 1024 * 1024).unwrap();
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
    /*let mut c = cube_to_big(&cube);
    println!("{:?}", c);
    print_cube(&cube);
    move_top2(&mut c);
    println!("{:?}", c);
    print_cube(&big_to_cube(&c));*/
    /*let x: Vec<u8> = vec![4,8,11,24];
    println!("{}", x.size_of());
    return;*/
    let mut sol: HashMap<Vec<u32>, Vec<u8>> = HashMap::new();
    states_from_sol(&mut sol, &get_solved_cube(cube.clone()));
    println!("{}", sol.len());
    
    let mut sta: HashMap<Vec<u32>, Vec<u8>> = HashMap::new();
    let mut arra: Vec<Vec<u32>> = vec![cube_to_big(&cube)];
    sta.insert(arra[0].clone(), vec![]);
    for n in 0..10000000 {
        if arra.len() <= n {
            println!("{}", arra.len());
            return;
        }
        let cur = sta[&arra[n]].clone();

        for m in 0..6 {
            let mut key = arra[n].clone();
            for o in 0..3 {
                single_move(&mut key, m);
                if !sta.contains_key(&key) {
                    if sol.contains_key(&key) {
                        sta.insert(key.clone(), vec![cur.clone(), vec![(m+(o*6)).try_into().unwrap()]].concat());
                        println!("{:?}", vec![sta[&key].clone(), sol[&key].clone()].concat());
                        print_cube(&big_to_cube(&key));
                        return;
                    }
                    if cur.len() < 6 {
                        arra.push(key.clone());
                        sta.insert(key.clone(), vec![cur.clone(), vec![(m+(o*6)).try_into().unwrap()]].concat());
                    }
                    
                }
            }
        }
        if n%10000 == 0 {
            println!("{} {}", n, arra.len())
        }
    }
}
