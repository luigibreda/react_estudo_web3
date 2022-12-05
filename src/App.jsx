import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0x3cbFb8de749e6e4E1eF5869C6870Cfe56AcD4580";
  const contractABI = abi.abi;
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Garanta que possua a Metamask instalada!");
        return;
      } else {
        console.log("Temos o objeto ethereum", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Encontrada a conta autorizada:", account);
        setCurrentAccount(account)
      } else {
        console.log("Nenhuma conta autorizada foi encontrada")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implemente aqui o seu método connectWallet
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask encontrada!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave2 = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Recuperado o número de tchauzinhos...", count.toNumber());
      } else {
        console.log("Objeto Ethereum não encontrado!");
      }
    } catch (error) {
      console.log(error)
    }
}

  const wave3 = async () => {
    try {
      const { ethereum } = window;

      
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Recuperado o número de tchauzinhos...", count.toNumber());

        /*
        * Executar o tchauzinho a partir do contrato inteligente
        */
        const waveTxn = await wavePortalContract.wave();
        console.log("Minerando...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Minerado -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Total de tchauzinhos recuperado...", count.toNumber());
      } else {
        console.log("Objeto Ethereum não encontrado!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const wave = () => {
    
  }

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Olá Pessoal!
        </div>

        <div className="bio">
        Eu sou o danicuki e já trabalhei com música, sabia? Legal, né? Conecte sua carteira  Ethereum wallet e me manda um tchauzinho!
        </div>

        {true ? <div className="header"><br/><CircularProgress id="progressBar" /></div> : ''}
        
        {currentAccount && (
        <button className="waveButton" onClick={wave2}>
          Ler os Tchauzinho 🌟
        </button>
        )}
        
        {currentAccount && (
        <button className="waveButton" onClick={wave3}>
          Mandar Tchauzinho 🌟
        </button> 
        )}
        
        {/*
        * Se não existir currentAccount, apresente este botão
        */}
        
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Conectar carteira
          </button>
        )}
      </div>
      
    </div>
  );
}