const ethers = require('ethers');
const aspJSON = require('../abi/asp.json');
const aspABI = aspJSON.abi;
require('dotenv').config();

const addCommitment = async (req, res) => {
    try {
        const commitment = req.body.commitment;
        const asp_address = req.body.asp_address;
        const network = req.body.network;
        let rpc;

        if (network === '80001') {
            rpc = process.env.RPC_MUMBAI;
        }

        const provider = new ethers.providers.JsonRpcProvider(rpc);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(asp_address, aspABI, provider);
        const contractWithWallet = contract.connect(wallet);

        let tx = await contractWithWallet.addUser(commitment);
        const _tx = await tx.wait();
        console.log(_tx);

        res.send({
            hash: _tx.transactionHash,
        });
    } catch (error) {
        console.error('Error adding commitment:', error);
        res.status(500).send({
            error: 'Internal Server Error',
        });
    }
};

module.exports = {
    addCommitment: addCommitment,
};
