/*use anyhow::Result;
use plonky2::field::types::Field;
use plonky2::iop::witness::PartialWitness;
use plonky2::iop::witness::WitnessWrite;
use plonky2::plonk::circuit_builder::CircuitBuilder;
use plonky2::plonk::circuit_data::CircuitConfig;
use plonky2::plonk::config::{GenericConfig, PoseidonGoldilocksConfig};
use plonky2::hash::merkle_tree::MerkleTree;
use plonky2::field::goldilocks_field::GoldilocksField;
use plonky2::hash::poseidon::PoseidonHash;

/// An example of using Plonky2 to prove a statement of the form
/// "I know x² - 4x + 7".
fn main() -> Result<()> {
    const D: usize = 2;
    type C = PoseidonGoldilocksConfig;
    type F = <C as GenericConfig<D>>::F;

    let config = CircuitConfig::standard_recursion_config();
    let mut builder = CircuitBuilder::<F, D>::new(config);

    // The arithmetic circuit.
    let x = builder.add_virtual_target();
    let y = builder.add_virtual_target();
    let r = builder.add(x, y);

    // Public inputs are the initial value (provided below) and the result (which is generated).
    let mt:MerkleTree<GoldilocksField, PoseidonHash> = MerkleTree::new(vec![vec![GoldilocksField::from_canonical_u64(2)], vec![GoldilocksField::from_canonical_u64(8)], vec![GoldilocksField::from_canonical_u64(11)], vec![GoldilocksField::from_canonical_u64(15)]], 2);
    let cap = mt.cap;
    println!("{}", cap.height());
    //let p = mt.prove(1);
    //verify_merkle_proof
    //builder.verify_merkle_proof
    builder.register_public_input(x);
    builder.register_public_input(y);
    builder.register_public_input(r);

    let mut pw = PartialWitness::new();
    pw.set_target(x, F::from_canonical_u32(9));
    pw.set_target(y, F::from_canonical_u32(7));
    let data = builder.build::<C>();
    let proof = data.prove(pw)?;
    println!(
        "(x + y) where x = {} and y = {} is {}",
        proof.public_inputs[0],
        proof.public_inputs[1],
        proof.public_inputs[2]
    );

    data.verify(proof)
}*/

/*
<iframe width="560" height="315" src="https://www.youtube.com/embed/gyMwXuJrbJQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
*/