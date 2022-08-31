import logo from "../../logo.svg";

import { useEffect, useState } from "react";

import { Button, Form, Typography, Input } from "antd";
import Web3 from "web3/dist/web3.min.js";
import abi from "./abi/ino.json";

const DemoBlockchain = () => {
  const [currentAccount, setCurrentAccount] = useState({
    account: "",
    balance: "",
    network: "",
  });
  const [currentTransaction, setCurrentTransaction] = useState();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const checkWallet = async () => {
      if (!window.ethereum) return;
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
      getAccountInfo();
    };
    checkWallet();
  }, []);

  useEffect(() => {
    const connectToContract = () => {
      // Declare provider
      let provider;

      // If user is on correct chain, set MetaMask as provider
      if (window.ethereum && window.ethereum.networkVersion === 97) {
        provider = window.ethereum;
      } else {
        provider = "https://data-seed-prebsc-1-s1.binance.org:8545";
      }

      const web3 = new Web3(provider);
      window.web3 = new Web3(provider);
      setContract(
        () =>
          new web3.eth.Contract(
            abi,
            "0x89a1926B53cA697762f80d379c32DC4B21EfEE95"
          )
      );
    };

    if (!contract) connectToContract();
  }, [contract]);

  const getAccountInfo = async () => {
    if (!window.ethereum) alert("Please install metamask");

    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const accountsBalanceToken = await web3.eth.getBalance(accounts[0]);
      const accountBalanceWallet = await web3.utils.fromWei(
        accountsBalanceToken
      );
      const network = await web3.eth.net.getNetworkType();
      setCurrentAccount({
        account: accounts[0],
        balance: accountBalanceWallet,
        network,
      });
    } catch (err) {
      if (err.code === 4001) {
        alert("Please connect to metamask");
      } else console.error(err);
    }
  };

  const sendNative = async (from, to, value) => {
    try {
      const web3 = new Web3(window.ethereum);
      const transaction = await web3.eth.sendTransaction({
        from,
        to,
        value: web3.utils.toWei(value.toString()),
      });
      setCurrentTransaction(transaction);
      getAccountInfo();
    } catch (e) {
      alert(e.message);
    }
  };

  const claimNft = () => {
    const web3 = new Web3(window.ethereum);
    const myContract = new web3.eth.Contract(
      abi,
      "0x89a1926B53cA697762f80d379c32DC4B21EfEE95"
    );
    myContract.methods
      .claim()
      .send({ from: currentAccount.account })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTransfer = (data) => {
    sendNative(currentAccount.account, data.toAccount, data.amount);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {currentAccount.account ? (
          <>
            <Typography.Text code style={{ color: "#fff" }}>
              Your account: {currentAccount.account}{" "}
              {currentAccount.network && (
                <span>({currentAccount.network})</span>
              )}
            </Typography.Text>
            <Typography.Text code style={{ color: "#fff" }}>
              Your balance: {currentAccount.balance}
            </Typography.Text>
          </>
        ) : (
          <Button onClick={getAccountInfo} type="emphasis">
            Connect metamask
          </Button>
        )}

        <Button onClick={claimNft} type="emphasis">
          Claim NFT
        </Button>

        {currentAccount.account &&
          (currentTransaction ? (
            <div
              style={{
                backgroundColor: "#fff",
                padding: "24px",
                marginTop: "24px",
              }}
            >
              <Typography.Title style={{ color: "green" }} level={2}>
                Transfer successfully
              </Typography.Title>
              <Typography.Text>Your transaction hash:</Typography.Text>{" "}
              <Typography.Text code>
                {currentTransaction.transactionHash}
              </Typography.Text>
            </div>
          ) : (
            <Form
              name="basic"
              style={{
                backgroundColor: "#fff",
                padding: "24px",
                marginTop: "24px",
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={handleTransfer}
              autoComplete="off"
            >
              <Typography.Title level={3}>Transfer ETH</Typography.Title>
              <Form.Item
                style={{ color: "#fff" }}
                label="Account"
                name="toAccount"
              >
                <Input />
              </Form.Item>

              <Form.Item label="Amount" name="amount">
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          ))}
      </header>
    </div>
  );
};

export default DemoBlockchain;
