// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LockModule", (m) => {
  const realEstate = m.contract("RealEstate");

  const escrow = m.contract("Escrow");
  m.getAccount(1);
  m.getAccount(2);
  m.getAccount(3);

  return { realEstate, escrow }
});

