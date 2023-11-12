## Crypto Mixer with Regulatory Compliance

zkCryptoMixer, a tool designed to enhance privacy for cryptocurrency transactions. By using Zero-Knowledge Proofs (zk-SNARKs) along with technologies like Circom, Solidity, and Next.js

## Commands wrt circuit
### Other commands with respect to this circuit

1. compile: `npx circom2 withdraw.circom --rics --wasm`
2. groth16
    1. generate ceremony file: `npx snarkjs powersoftau new bn128 12 ceremony_0000.ptau`
    2. contribute in ceremony: `npx snarkjs powersoftau contribute ceremony_0000.ptau ceremony_ 0001.ptau`
    3. prepare for phase2: `npx snarkjs powersoftau prepare phase2 ceremony_0001.ptau ceremony_final.ptau -v`
    4. verifying ceremony file: `npx snarkjs powersoftau verify ceremony_0000.ptau`
    5. Groth16 setup: `npx snarkjs groth16 setup withdraw.r1cs ceremony_final.ptau setup_0000.zkey`
    6. Adding randomness to the zkey file : `npx snarkjs zkey contribute setup_0000.zkey setup_final.zkey`
    7. Verifying zkey file: `npx snarkjs zkey verify withdraw.r1cs ceremony_final.ptau setup_final.zkey`
    8. export solidity contract: `npx snarkjs zkey export solidityverifier setup_final.zkey Verifier.sol`
