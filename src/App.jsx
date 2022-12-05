import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");

  const [mining, setMining] = useState(false);
  
  const contractAddress = "0xAA61131A4340d1d6609c7D534e626a3b0E89aF24";
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
        alert("Recuperado o número de tchauzinhos...", count.toNumber());
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
        console.log("Minerando....", waveTxn.hash);
        setMining(true);
        
        await waveTxn.wait();
        console.log("Minerado -- ", waveTxn.hash);
        setMining(false);
        
        count = await wavePortalContract.getTotalWaves();
        console.log("Total de tchauzinhos recuperado... Nmro:", count.toNumber());
        
        alert("Voce enviou um tchauzinho, agora temos um total de: ", count.toNumber());
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
        Eu sou o Luigi e trabalho com desenvolvimento e programação a mais de 10 anos, sabia? Legal, né? <br /><br /> Conecte sua carteira Metamask wallet ou qualquer outra e me manda um tchauzinho!
        </div>

        {currentAccount && (
        <button className="waveButton" onClick={wave2}>
          Ler os Tchauzinho 🌟
        </button>
        )} 
        

        {currentAccount && (
        <button className="waveButton" onClick={wave3} disabled={mining}>
          {mining ? "Waving..." : "Wave at Me"}
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