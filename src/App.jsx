import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [mining, setMining] = useState(false);
  const [waves, setWaves] = useState([]);
  const [waveMessage, setWaveMessage] = useState("Sua mensagem coloque aqui.");
  const contractAddress = "0x040576E4be8E0387a9e8ABF716F83d8c64ACb9c1";
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
        
        const waveTxn = await wavePortalContract.wave(waveMessage, {gasLimit: 300000 });
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
        const result = await wavePortalContract.getWaves(signer.getAddress());
        const {0: messages, 1: timestamps} = result;
        let wavesCleaned = [];
        for (let i = 0; i < messages.length; i++) {
          wavesCleaned.push({
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
    /*
   * M??todo para consultar todos os tchauzinhos do contrato
   */
  
  const [allWaves, setAllWaves] = useState([]);
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractAbi, signer);

        /*
         * Chama o m??todo getAllWaves do seu contrato inteligente
         */
        const waves = await wavePortalContract.getAllWaves();
        console.log('getALLWAVES');

        /*
         * Apenas precisamos do endere??o, data/hor??rio, e mensagem na nossa tela, ent??o vamos selecion??-los
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Armazenando os dados
         */
        setAllWaves(wavesCleaned);
        console.log('getALLWAVE2');
        console.log(wavesCleaned);
      } else {
        console.log("Objeto Ethereum n??o existe!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleMsgChange = evt => {
    evt.preventDefault();
    setWaveMessage(evt.target.value);
  };

  useEffect(() => {
    let wavePortalContract;

    checkIfWalletIsConnected();
    console.log('log1');
    getAllWaves();

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

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
        ???? Ol?? Pessoal!
        </div>

        <div className="bio">
        Eu sou o Luigi e j?? trabalho como Dev a mais de 10 anos, sabia? Legal, n??? 
          <br></br>
        Conecte sua carteira Ethereum wallet e me manda um tchauzinho!
          <br></br>
          <br></br>
          Aproveite para mandar um oi, ficar?? salvo na Blockchain!
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
          {mining ? "Enviando..." : "Envie um tchauzinho! ????"}
        </button>
        )}
        
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Endere??o: {wave.address}</div>
              <div>Data/Hor??rio: {wave.timestamp.toString()}</div>
              <div>Mensagem: {wave.message}</div>
            </div>)
        })}
        
      </div>
    </div>
  );
}