import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber as BN, Signer } from "ethers";
import { AccessControlContract, AccessControlContract__factory } from "../typechain-types";

describe("Test", function () {
  let accounts: Signer[];
  let admin: Signer;
  let minter: Signer;
  let burner: Signer;
   let ctr: AccessControlContract;

   before(async () => {
       accounts = await ethers.getSigners();
       admin = accounts[0];
       minter = accounts[1];
       burner = accounts[2];
       const factory = new AccessControlContract__factory(accounts[0]);
       ctr = await factory.deploy(
           await minter.getAddress(),
           await burner.getAddress(),
           );
   });
   it("setup maxMint", async() => {
    const value = 10
    await ctr.setupMaxMint(value)
    expect(await ctr.getMaxMint()).to.eq(value)

    await expect(ctr.connect(minter).setupMaxMint(value)).to.be.revertedWith("Caller is not a admin")

    await expect(ctr.connect(burner).setupMaxMint(value)).to.be.revertedWith("Caller is not a admin")
   })

   it("setup maxBurn", async() => {
    const value = 100
    await ctr.setupMaxBurn(value)
    expect(await ctr.getMaxBurn()).to.eq(value)

    await expect(ctr.connect(minter).setupMaxBurn(value)).to.be.revertedWith("Caller is not a admin")

    await expect(ctr.connect(burner).setupMaxBurn(value)).to.be.revertedWith("Caller is not a admin")
   })

   it("check burn", async() => {
    const value = 100
    await ctr.setupMaxBurn(value)
    await expect(ctr.connect(burner).burn( admin.getAddress(),value + 1)).to.be.revertedWith("Attempt to burn an invalid amount")


    await expect(ctr.connect(minter).burn( admin.getAddress(),value)).to.be.revertedWith("Caller is not a burner")

    await expect(ctr.connect(admin).burn( admin.getAddress(),value)).to.be.revertedWith("Caller is not a burner")
   })

   it("check mint", async() => {
    const value = 100
    await ctr.setupMaxMint(value)
    await expect(ctr.connect(minter).mint( admin.getAddress(),value + 1)).to.be.revertedWith("Attempt to mint an invalid amount")


    await expect(ctr.connect(burner).mint( admin.getAddress(),value)).to.be.revertedWith("Caller is not a minter")

    await expect(ctr.connect(admin).mint( admin.getAddress(),value)).to.be.revertedWith("Caller is not a minter")
   })
})