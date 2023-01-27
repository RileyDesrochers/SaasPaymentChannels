mod utils;

use wasm_bindgen::prelude::*;
//use wasm_bindgen::JsValue;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(s: &str) {
    alert(s);
}

fn print_help(cell: &Vec<u8>) -> String {
    return if cell.len() == 1 {format!("{}",(cell[0] as u32).to_string())} else {format!("{}", "0"/* , cell.len().to_string()*/)};
}

fn print_puzzle(puzzle: &Vec<Vec<Vec<u8>>>){
    for n in 0..9 {
        if n == 3 || n == 6 {
            println!("-------------------------");
        }
        println!("| {} {} {} | {} {} {} | {} {} {} |", 
        print_help(&puzzle[n][0]),
        print_help(&puzzle[n][1]),
        print_help(&puzzle[n][2]),

        print_help(&puzzle[n][3]),
        print_help(&puzzle[n][4]),
        print_help(&puzzle[n][5]),

        print_help(&puzzle[n][6]),
        print_help(&puzzle[n][7]),
        print_help(&puzzle[n][8]),
        );
    }
}

/*fn puzzle_to_str2(puzzle: &Vec<Vec<u8>>) -> &str {
    return &format!("| {} {} {} | {} {} {} | {} {} {} |", 
        print_help(&puzzle[0]),
        print_help(&puzzle[1]),
        print_help(&puzzle[2]),

        print_help(&puzzle[3]),
        print_help(&puzzle[4]),
        print_help(&puzzle[5]),

        print_help(&puzzle[6]),
        print_help(&puzzle[7]),
        print_help(&puzzle[8]),
    );
}

fn puzzle_to_str(puzzle: &Vec<Vec<Vec<u8>>>) -> str {
        /*if n == 3 || n == 6 {
            println!("-------------------------");
        }*/
    return format!("{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}", 
        puzzle_to_str2(&puzzle[0]),
        puzzle_to_str2(&puzzle[1]),
        puzzle_to_str2(&puzzle[2]),

        puzzle_to_str2(&puzzle[3]),
        puzzle_to_str2(&puzzle[4]),
        puzzle_to_str2(&puzzle[5]),

        puzzle_to_str2(&puzzle[6]),
        puzzle_to_str2(&puzzle[7]),
        puzzle_to_str2(&puzzle[8]),
    );
}*/

fn all_possibilities() -> Vec<u8> {
    return vec![1,2,3,4,5,6,7,8,9];
}

fn check_possibilities_quadrant(puzzle: &mut Vec<Vec<Vec<u8>>>){
    for n in 0..3 {
        for m in 0..3 {

            for o in 0..3 {
                for p in 0..3 {

                    if puzzle[(n*3)+o][(m*3)+p].len() == 1 {
                        let ele = puzzle[(n*3)+o][(m*3)+p][0];
                        for o2 in 0..3 {
                            for p2 in 0..3 {
                                if o == o2 && p == p2{
                                    continue;
                                }
                                puzzle[(n*3)+o2][(m*3)+p2].retain(|&x| x != ele);
                            }
                        }
                    }
                }
            }
        }
    }
}

fn check_possibilities_row(puzzle: &mut Vec<Vec<Vec<u8>>>){
    for n in 0..9 {
        for m in 0..9 {
            if puzzle[n][m].len() == 1 {
                let ele = puzzle[n][m][0];
                for m2 in 0..9 {
                    if m == m2 {
                        continue;
                    }
                    puzzle[n][m2].retain(|&x| x != ele);
                }
            }
        }
    }
}

fn check_possibilities_col(puzzle: &mut Vec<Vec<Vec<u8>>>){
    for n in 0..9 {
        for m in 0..9 {
            if puzzle[m][n].len() == 1 {
                let ele = puzzle[m][n][0];
                for m2 in 0..9 {
                    if m == m2 {
                        continue;
                    }
                    puzzle[m2][n].retain(|&x| x != ele);
                }
            }
        }
    }
}

fn check_possibilities(puzzle: &mut Vec<Vec<Vec<u8>>>) {
    check_possibilities_row(puzzle);
    check_possibilities_col(puzzle);
    check_possibilities_quadrant(puzzle);
}

fn is_valid(puzzle: &Vec<Vec<Vec<u8>>>) -> bool {
    for n in 0..9 {
        for m in 0..9 {
            if puzzle[n][m].len() == 0 {
                return false;
            }
        }
    }
    return true;
}

fn get_hints(puzzle: &Vec<Vec<Vec<u8>>>) -> u8 {
    let mut hints: u8 = 0;
    for n in 0..9 {
        for m in 0..9 {
            if puzzle[n][m].len() == 1 {
                hints += 1;
            }
        }
    }
    return hints;
}

fn guess(puzzle: &mut Vec<Vec<Vec<u8>>>) -> bool {
    let mut best = 10;
    let mut r = 0;
    let mut c = 0;
    for n in 0..9 {
        for m in 0..9 {
            if puzzle[n][m].len() < best && puzzle[n][m].len() > 1 {
                (best, r, c) = (puzzle[n][m].len(), n, m);
            }
        }
    }

    //println!("guess cell {} {}", r, c);
    let mut sols: Vec<Vec<Vec<Vec<u8>>>> = vec![];
    for n in 0..best {
        let mut tmp = puzzle.clone();
        tmp[r][c] = vec![puzzle[r][c][n]];
        //print_puzzle(&tmp);
        //println!("----------------");
        sols.push(tmp);
    }
    for mut n in sols {
        if solve(&mut n) {
            *puzzle = n;
            return true;
        }
    }
    return false;
}


fn solve(puzzle: &mut Vec<Vec<Vec<u8>>>) -> bool {
    let mut hints: u8 = 0;

    while hints != get_hints(puzzle) {
        hints = get_hints(puzzle);
        check_possibilities(puzzle);
    }
    if !is_valid(puzzle) {
        return false;
    }

    if hints == 81 {
        return true;
    }
    if guess(puzzle) {
        return true;
    }else{
        return false;
    }
}

#[wasm_bindgen]
pub fn sol(s: js_sys::Array) -> js_sys::Array{
    let mut puzzle: Vec<Vec<Vec<u8>>> = vec![
        vec![vec![]; 9],
        vec![vec![]; 9],
        vec![vec![]; 9],

        vec![vec![]; 9],
        vec![vec![]; 9],
        vec![vec![]; 9],

        vec![vec![]; 9],
        vec![vec![]; 9],
        vec![vec![]; 9]
    ];
    let bytes: Vec<JsValue> = s.to_vec();
    let mut puz: Vec<Vec<u8>> = vec![
        js_sys::Uint8Array::new(&bytes[0]).to_vec(),
        js_sys::Uint8Array::new(&bytes[1]).to_vec(),
        js_sys::Uint8Array::new(&bytes[2]).to_vec(),
        js_sys::Uint8Array::new(&bytes[3]).to_vec(),
        js_sys::Uint8Array::new(&bytes[4]).to_vec(),
        js_sys::Uint8Array::new(&bytes[5]).to_vec(),
        js_sys::Uint8Array::new(&bytes[6]).to_vec(),
        js_sys::Uint8Array::new(&bytes[7]).to_vec(),
        js_sys::Uint8Array::new(&bytes[8]).to_vec()
    ];
    for n in 0..puz.len() {
        for m in 0..puz[n].len() {
            if puz[n][m] == 0 {
                puzzle[n][m] = all_possibilities();
            }else{
                puzzle[n][m] = vec![puz[n][m]];
            }
        }
    }
    if solve(&mut puzzle) {
        let mut t = js_sys::Array::new_with_length(9);
        for n in 0..9 {
            let arr = js_sys::Uint8Array::new_with_length(9);
            arr.copy_from(&puzzle[n].concat());
            t.set(n as u32, arr.into());
        }
        return t;
    }
    return s;


    /*for n in 0..puzzle.len() {
        for m in 0..puzzle[n].len() {
            if puzzle[n][m] == all_possibilities() {
                puzzle[n][m] = vec![0];
            }
        }
    }*/

}