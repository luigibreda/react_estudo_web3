import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [mining, setMining] = useState(false);
  const [waves, setWaves] = useState([]);
  const [waveMessage, setWaveMessage] = useState("Sua mensagem coloque aqui.");
  const contractAddress = "0x27C85420049B016C0070D02F68844A1567455B6C";
  const contractAbi = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if ( !ethereum ) {
        console.log('Make sure you have metamask!');
      } else {
        console.log('We have the ethereum object: ', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if ( !accounts.length ) console.log("No authorized account found!!!")
        else {
          const account = accounts[0];
          console.log('Found an authorized account: ', account);
          setCurrentAccount(account);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if ( !ethereum ) {
        alert('Get Metamask!!!');
        return;
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Connected: ', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch(err) {
      console.log(err);
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;
      if ( ethereum ) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractAbi, signer);
        
        const waveTxn = await wavePortalContract.wave(waveMessage, {gasLimit: 300000});
        console.log("Mining ... ", waveTxn.hash);
        setMining(true);
        await waveTxn.wait();
        setMining(false);
        console.log("Mined - ", waveTxn.hash);
        
        const waveCount = await wavePortalContract.getWaves(currentAccount);
        console.log("%d wave(s) from %s", waveCount, currentAccount);

        // await getWaves();
      }
    } catch(err) {
      console.log(err);
    }
  }

  const getWaves = async() => {
    try {
      const {ethereum} = window;
      if ( ethereum ) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractAbi, signer);
        const result = await wavePortalContract.getAllWaves(signer.getAddress());
        const {0: messages, 1: timestamps} = result;
        let wavesCleaned = [];
        for (let i = 0; i < messages.length; i++) {
          wavesCleaned.push({
            address: address[i],
            message: messages[i],
            timestamp: timestamps[i],
          });
        }
        setWaves(wavesCleaned);
      }
    } catch(err) {
      console.log(err);
    }
  }

  const handleMsgChange = evt => {
    evt.preventDefault();
    setWaveMessage(evt.target.value);
  };

  useEffect(() => {
    let wavePortalContract;

    checkIfWalletIsConnected();
    getWaves();

    const onNewWave = (message, timestamp) => {
      console.log("Message arrived:", message);
      setWaves(prevState => [
        ...prevState,
        {
          message,
          timestamp
        }
      ]);
    }

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      wavePortalContract = new ethers.Contract(contractAddress, contractAbi, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    }
  }, []);
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Olá Pessoal!
        </div>

        <div className="bio">
        Eu sou o Luigi e já trabalhei com música, sabia? Legal, né? 
        Conecte sua carteira Ethereum wallet e me manda um tchauzinho!
        </div>
        
        {currentAccount && (
        <input className="waveMessage" value={waveMessage} onChange={handleMsgChange}></input>
        )}
        
        {!currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
            Conectar carteira
          </button>
        )}

        {currentAccount && (
        <button className="waveButton" onClick={wave} disabled={mining}>
          {mining ? "Enviando..." : "Envie um tchauzinho! 🌟"}
        </button>
        )}

        {waves.map((wave, index) => (
          <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Hora: {new Date(wave.timestamp*1000).toISOString()}</div>
              <div>Mensagem: {wave.address}</div>
              <div>Mensagem: {wave.message}</div>
            </div>)
        )}
      </div>
    </div>
  );
}