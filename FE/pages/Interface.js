import { useState, useContext, useRef } from "react";
import utils from "../utils/$u.js";
import { ethers } from "ethers";
import styles from "../style/Interface.module.css";
import Layout from "../components/layout.js";
import AccountContext from "../utils/accountContext";
const wc = require("../circuit/witness_calculator.js");
const tornadoJSON = require("../json/Tornado.json");
const tornadoABI = tornadoJSON.abi;
const tornadoInterface = new ethers.utils.Interface(tornadoABI);

const aspJSON = require("../json/Asp.json");
const aspABI = aspJSON.abi;
const aspInterface = new ethers.utils.Interface(aspABI);

const tornadoAddress = "0x19d0B5243476C4012A9dc93F0697f7ad8B079d39";
const aspAddress = "0xcB8B44c4190C65C58bb602230Ab8f8490D621014";
let tempData = null;

export default function Interface() {
  const proofTextAreaRef = useRef(null);
  const withdrawTextAreaRef = useRef(null); // Add this line to declare withdrawTextAreaRef

  const [activeTab, setActiveTab] = useState("deposit");
  const [token, setToken] = useState("ETH");
  const [amount, setAmount] = useState("1");
  const { account } = useContext(AccountContext);
  const [proofElements, updateProofElements] = useState(null);
  const [proofStringEl, updateProofStringEl] = useState(null);
  const [proof, setProof] = useState("");
  const [asp, setAsp] = useState("ASP1");
  const [withdrawProof, setWithdrawProof] = useState("");
  const [aspData, updateAspData] = useState(null);

  const handleTokenChange = (e) => {
    const selectedToken = e.target.value;
    setToken(selectedToken);
    // Set the default amount based on the token selected for both deposit and withdrawal
    setAmount(selectedToken === "ETH" ? "0.01" : "1000");
  };
  async function waitForTransactionReceipt(txHash) {
    while (true) {
      const receipt = await window.ethereum.request({
        method: "eth_getTransactionReceipt",
        params: [txHash],
      });

      if (receipt !== null) {
        return receipt; // Transaction mined, return receipt
      }

      // If receipt is not yet available, wait for a while before checking again
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
    }
  }
  const depositEther = async () => {
    const secret = ethers.BigNumber.from(
      ethers.utils.randomBytes(32)
    ).toString();
    const nullifier = ethers.BigNumber.from(
      ethers.utils.randomBytes(32)
    ).toString();

    const input = {
      secret: utils.BN256ToBin(secret).split(""),
      nullifier: utils.BN256ToBin(nullifier).split(""),
    };

    var res = await fetch("/deposit.wasm");
    var buffer = await res.arrayBuffer();
    var depositWC = await wc(buffer);

    const r = await depositWC.calculateWitness(input);

    const commitment = r[1];
    const nullifierHash = r[2];
    console.log("commitment", commitment);

    const value = ethers.BigNumber.from("10000000000000000").toHexString();
    const tx = {
      to: tornadoAddress,
      from: account.address,
      value: value,
      data: tornadoInterface.encodeFunctionData("deposit", [commitment]),
    };

    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [tx],
      });
      const receipt = await waitForTransactionReceipt(txHash);
      console.log(receipt);
      const log = receipt.logs[1];

      const decodedData = tornadoInterface.decodeEventLog(
        "Deposit",
        log.data,
        log.topics
      );

      const proofElements = {
        root: utils.BNToDecimal(decodedData.root),
        nullifierHash: `${nullifierHash}`,
        secret: secret,
        nullifier: nullifier,
        commitment: `${commitment}`,
        hashPairing: decodedData.hashPairings.map((n) => utils.BNToDecimal(n)),
        hashDirections: decodedData.pairDirection,
      };
      console.log(proofElements);

      updateProofElements(btoa(JSON.stringify(proofElements)));
    } catch (error) {
      console.log(error);
    }

    console.log(commitment, nullifierHash);
  };
  const withdraw = async () => {
    console.log("log1");
    // updateWithdrawButtonState(ButtonState.Disabled);
    await callASP();
    console.log("log2");

    const withdrawProofValue = withdrawTextAreaRef.current
      ? withdrawTextAreaRef.current.value
      : "";
    console.log("log3");

    if (!withdrawProofValue) {
      alert("Please input the proof of deposit string.");
      return;
    }
    console.log("log4");

    try {
      const proofString = withdrawTextAreaRef.current.value;
      const proofElements = JSON.parse(atob(proofString));
      // const b_aspData = JSON.parse(atob(aspData));
      const b_aspData = aspData;
      console.log(proofElements);
      console.log("log5");

      //         receipt = await window.ethereum.request({ method: "eth_getTransactionReceipt", params: [proofElements.txHash] });
      //         if(!receipt){ throw "empty-receipt"; }

      //         const log = receipt.logs[0];
      //         const decodedData = tornadoInterface.decodeEventLog("Deposit", log.data, log.topics);
      console.log(1);
      const SnarkJS = window["snarkjs"];
      console.log(2);
      // console.log(aspData);
      console.log(tempData);
      const proofInput = {
        root: proofElements.root, //utils.BNToDecimal(decodedData.root),
        nullifierHash: proofElements.nullifierHash,
        recipient: utils.BNToDecimal(account.address),
        associationHash: tempData.root,
        associationRecipient: utils.BNToDecimal(account.address),
        secret: utils.BN256ToBin(proofElements.secret).split(""),
        nullifier: utils.BN256ToBin(proofElements.nullifier).split(""),
        hashPairings: proofElements.hashPairing, //decodedData.hashPairings.map((n) => ($u.BNToDecimal(n))),
        hashDirections: proofElements.hashDirections, //decodedData.pairDirection,
        associationHashPairings: tempData.hashPairing, //decodedData.hashPairings.map((n) => ($u.BNToDecimal(n))),
        associationHashDirections: tempData.hashDirections, //decodedData.pairDirection
      };
      console.log(3);
      const { proof, publicSignals } = await SnarkJS.groth16.fullProve(
        proofInput,
        "/withdraw.wasm",
        "/setup_final.zkey"
      );
      console.log(4);
      console.log("=========================================");
      console.log(proof);
      console.log(publicSignals);
      const callInputs = [
        proof.pi_a.slice(0, 2).map(utils.BN256ToHex),
        proof.pi_b
          .slice(0, 2)
          .map((row) => utils.reverseCoordinate(row.map(utils.BN256ToHex))),
        proof.pi_c.slice(0, 2).map(utils.BN256ToHex),
        publicSignals.slice(0, 3).map(utils.BN256ToHex),
      ];

      const callData = tornadoInterface.encodeFunctionData(
        "withdraw",
        callInputs
      );
      const tx = {
        to: tornadoAddress,
        from: account.address,
        data: callData,
      };
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [tx],
      });
      const receipt = await waitForTransactionReceipt(txHash);

      //         var receipt;
      //         while(!receipt){
      //             receipt = await window.ethereum.request({ method: "eth_getTransactionReceipt", params: [txHash] });
      //             await new Promise((resolve, reject) => { setTimeout(resolve, 1000); });
      //         }

      //         if(!!receipt){ updateWithdrawalSuccessful(true); }
    } catch (e) {
      console.log(e);
      console.log("log5--");
    }
    console.log("log6");

    //     updateWithdrawButtonState(ButtonState.Normal);
  };
  const callASP = async () => {
    const tx = {
      to: aspAddress,
      from: account.address,
      data: aspInterface.encodeFunctionData("addUser"),
    };

    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [tx],
      });
      const receipt = await waitForTransactionReceipt(txHash);
      console.log(receipt);
      const log = receipt.logs[0];

      const decodedData = aspInterface.decodeEventLog(
        "userAdded",
        log.data,
        log.topics
      );

      const aspElements = {
        root: utils.BNToDecimal(decodedData.root),
        hashPairing: decodedData.hashPairings.map((n) => utils.BNToDecimal(n)),
        hashDirections: decodedData.pairDirection,
      };

      // updateAspData(btoa(JSON.stringify(aspElements)));
      updateAspData(aspElements);
      tempData = aspElements;

      console.log("===============!!!!!!!!===============");
      console.log("aspElements", aspElements);
      // console.log('btoa(JSON.stringify(aspElements))',btoa(JSON.stringify(aspElements)));
      console.log("================!!!!!!!!!!!==============");
    } catch (error) {
      console.log(error);
    }
  };

  const copyProof = () => {
    // Check if the text area exists
    if (proofTextAreaRef.current) {
      proofTextAreaRef.current.select(); // Select the text inside the text area
      document.execCommand("copy"); // Execute the copy command
    }
  };

  return (
    <div className={styles.interface}>
      {account ? (
        <p>Account Address: {account.address}</p>
      ) : (
        <p>No account connected</p>
      )}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("deposit")}
          className={`${styles.tab} ${
            activeTab === "deposit" ? styles.active : ""
          }`}
        >
          Deposit
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={`${styles.tab} ${
            activeTab === "withdraw" ? styles.active : ""
          }`}
        >
          Withdraw
        </button>
      </div>

      <div className={styles.form}>
        <label htmlFor="amount">Amount</label>
        <input
          type="text"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label htmlFor="token">Token</label>
        <select id="token" value={token} onChange={handleTokenChange}>
          <option value="ETH">ETH</option>
          <option value="USDC">USDC</option>
        </select>

        {activeTab === "deposit" ? (
          <>
            <button onClick={depositEther} className={styles.depositButton}>
              Deposit
            </button>
            <textarea
              ref={proofTextAreaRef} // Attach the ref to the textarea
              className={styles.proof}
              value={proofElements} // Set the text content to proofElements state
            />{" "}
            <button onClick={copyProof} className={styles.copyButton}>
              Copy
            </button>
          </>
        ) : (
          <>
            <textarea
              ref={withdrawTextAreaRef} // Attach the ref to the withdrawal textarea
              className={styles.proof}
              defaultValue={proofElements} // Set the default value to proofElements
              onChange={(e) => setWithdrawProof(e.target.value)} // Update state on change
              placeholder="Paste the deposit proof here"
            />

            <label htmlFor="asp">ASP</label>
            <select
              id="asp"
              value={asp}
              onChange={(e) => setAsp(e.target.value)}
            >
              <option value="ASP1">ASP1</option>
              {/* More options will be added here */}
            </select>

            <button
              onClick={withdraw}
              className={styles.withdrawButton}
              disabled={!withdrawProof}
            >
              Withdraw
            </button>
          </>
        )}
      </div>
    </div>
  );
}
