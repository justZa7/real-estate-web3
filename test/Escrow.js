const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
}

describe("Escrow", () => {
  let buyer, seller, inspector, lender;
  let realEstate, escrow;

  beforeEach(async () => {
    [buyer, seller, inspector, lender] = await ethers.getSigners();

    // deploy real estate
    const RealEstate = await ethers.getContractFactory("RealEstate");
    realEstate = await RealEstate.deploy();

    // mint
    let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS");
    await transaction.wait();

    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(
      realEstate.getAddress(),
      seller.getAddress(),
      inspector.getAddress(),
      lender.getAddress(),
    );

    // approve property
    transaction = await realEstate.connect(seller).approve(escrow.getAddress(), 0);
    await transaction.wait();

    // list property
    transaction = await escrow.connect(seller).list(0, buyer.address, tokens(10), tokens(5));
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("Returns NFT Address", async () => {
      let result = await escrow.nftAddress();
      expect(result).to.equal(await realEstate.getAddress());
    });
  
    it("Returns Seller", async () => {
      result = await escrow.seller();
      expect(result).to.equal(await seller.getAddress());
    });
  
    it("Returns Inspector", async () => {
      result = await escrow.inspector();
      expect(result).to.equal(await inspector.getAddress());
    });
  
    it("Returns Lender", async () => {
      result = await escrow.lender();
      expect(result).to.equal(await lender.getAddress());
    });
  })

  describe("Listing", () => {
    it("Updates as Listed", async () => {
      const result = await escrow.isListed(0);
      expect(result).to.equal(true);  
    });

    it("Updates Ownership", async () => {
      expect(await realEstate.ownerOf(0)).to.equal(await escrow.getAddress());
    });

    it("Returns Buyer", async () => {
      const result = await escrow.buyer(0);
      expect(result).to.equal(await buyer.getAddress());
    });

    it("Returns Price", async () => {
      const result = await escrow.purchasePrice(0);
      expect(result).to.equal(tokens(10));
    })

    it("Resturn escrow amount", async () => {
      const result = await escrow.escrowAmount(0);
      expect(result).to.equal(tokens(5));
    })
  });

  describe("Deposit", () => {
    it("Updates contract balance", async () => {
      const transaction = await escrow.connect(buyer).depositEarnest(0, { value: tokens(5) });
      await transaction.wait();

      const result = await escrow.getBalance();
      expect(result).to.equal(tokens(5));
    });
  });

  describe("Inspection", () => {
    it("Updates inspection status", async () => {
      const transaction = await escrow.connect(inspector).updateInspectionStatus(0, true);
      await transaction.wait();

      const result = await escrow.inspectionPassed(0);
      expect(result).to.equal(true);
    });
  });
});