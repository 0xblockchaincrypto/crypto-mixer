const ethers = require('ethers');
const aspJSON = require('../abi/asp.json');
const aspABI = aspJSON.abi;
require('dotenv').config();

function getRPC(input) {
    switch (input) {
      case '534351':
        return "https://sepolia-rpc.scroll.io/"; //scrollSepolia
  
      case '84531':
        return "https://base-goerli.public.blastapi.io"; //base
  
      case '421613':
        return "https://goerli-rollup.arbitrum.io/rpc"; // arbitrumGoerli
    
      case '80001':
        return "https://rpc.ankr.com/polygon_mumbai"; // mumbai
  
      case '44787':
        return "https://alfajores-forno.celo-testnet.org"; // celo
  
      case '5001':
        return "https://rpc.testnet.mantle.xyz"; // Mantle
  
      case '195':
        return "https://testrpc.x1.tech/"; // Okx
  
      case '1442':
        return "https://rpc.public.zkevm-test.net"; // polygonzkevm
  
      default:
        throw new Error('Invalid input. No matching case found.');;
    }
  }

const addCommitment = async (req, res) => {
    try {
        const commitment = req.body.commitment;
        const asp_address = req.body.asp_address;
        const network = req.body.network;
        let rpc = getRPC(network);

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
