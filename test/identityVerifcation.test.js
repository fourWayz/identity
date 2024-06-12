const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IdentityVerification", function () {
  let IdentityVerification;
  let identityVerification;
  let admin;
  let verifier;
  let user;

  beforeEach(async function () {
    [admin, verifier, user] = await ethers.getSigners();
    IdentityVerification = await ethers.getContractFactory("IdentityVerification");
    identityVerification = await IdentityVerification.deploy();
    await identityVerification.deployed();
    await identityVerification.assignRole(verifier.address, 2); // 2 is Verifier role
  });

  it("Should assign roles correctly", async function () {
    expect(await identityVerification.roles(verifier.address)).to.equal(2); // 2 is Verifier role
  });

  it("Should add, update, verify, revoke, and delete identity", async function () {
    await identityVerification.addIdentity(user.address, "Alice", "alice@example.com");
    let identity = await identityVerification.getIdentity(user.address);
    expect(identity.name).to.equal("Alice");

    await identityVerification.updateIdentity(user.address, "Alice Updated", "alice_updated@example.com");
    identity = await identityVerification.getIdentity(user.address);
    expect(identity.name).to.equal("Alice Updated");

    await identityVerification.connect(verifier).verifyIdentity(user.address);
    expect(await identityVerification.isIdentityVerified(user.address)).to.be.true;

    await identityVerification.revokeIdentity(user.address);
    expect(await identityVerification.isIdentityVerified(user.address)).to.be.false;

    await identityVerification.deleteIdentity(user.address);
    await expect(identityVerification.getIdentity(user.address)).to.be.revertedWith("Identity does not exist");
  });

  it("Should log actions", async function () {
    await identityVerification.addIdentity(user.address, "Alice", "alice@example.com");
    await identityVerification.updateIdentity(user.address, "Alice Updated", "alice_updated@example.com");

    await expect(identityVerification.connect(verifier).verifyIdentity(user.address))
      .to.emit(identityVerification, 'IdentityActionLogged')
      .withArgs("Identity Verified");
  });
});
