/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-toolbox')
require('@nomicfoundation/hardhat-chai-matchers')
require('hardhat-deploy')
require('dotenv').config()

const wallet_private_key = process.env.wallet_private_key // private key
const sepolia_rpc = process.env.sepolia_rpc // rpc url

module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "hardhat",
  networks: {
      hardhat: {
          chainId: 31337,
      },
     sepolia :{
      url : sepolia_rpc,
      chainId : 11155111,
      accounts :[wallet_private_key]
     }
    },
    namedAccounts: {
      deployer: {
          default: 0, 
          1: 0, 
      },     
  },
};