## Projeto em React Front-End para Web3
# React Estudo Web3

[![waveportal](https://iili.io/HCvmpJj.png)](https://iili.io/HCvmpJj.png)

Projeto criado em React para integrar com o Smart Contract e criar uma interface gráfica para poder executar as funções na blockchain

### Stack Usado
- Solidity
- Hardhat
- Ethers.js
- React
- Brave Wallet
- Vercel
- Repl.it

### Smart Contract BSC
- [Testnet BSC](https://testnet.bscscan.com/address/0x040576E4be8E0387a9e8ABF716F83d8c64ACb9c1)

### Intruções de instalação

``` bash
# instalar dependencias
$ npm install

# iniciar servidor local
$ npx hardhat node

# executar scripts de testes
$ npx hardhat run scripts/run.js --network localhost

# deploy do smart contract
$ npx hardhat run scripts/deploy.js --network localhost

# iniciar aplicação
$ npm run dev
```