mod utils;

use std::fs;
use wasm_bindgen::prelude::*;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
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
pub fn sol() {
    alert("Hello, {{project-name}}!");
}

fn read_puzzle(file: &str) -> Vec<Vec<Vec<u8>>> {
    let contents = fs::read_to_string(file)
        .expect("Should have been able to read the file");
    let mut inp: Vec<Vec<Vec<u8>>> = contents.split('\n').map(|x| x.split(" ").map(|y| vec![y.parse::<u8>().unwrap()]).collect()).collect();//.collect();//.map(|x| println!("{:?}", x));

    for n in 0..inp.len() {
        for m in 0..inp[n].len() {
            if inp[n][m] == vec![0] {
                inp[n][m] = all_possibilities();
            }
        }
    }
    return inp;
}

fn main() {
    let mut puzzle: Vec<Vec<Vec<u8>>> = read_puzzle("./in.txt");
    if solve(&mut puzzle) {
        print_puzzle(&puzzle);
    }else{
        println!("puzzle cannot be solved");
    }
}
