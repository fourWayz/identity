const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IdentityVerification", function () {
    let IdentityVerification;
    let contract;
    let owner;
    let user1;
    let user2;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        IdentityVerification = await ethers.getContractFactory("IdentityVerification");
        contract = await IdentityVerification.deploy();
        await contract.deployed();
    });

    it("Should allow a user to add their own identity", async function () {
        await contract.connect(user1).addIdentity("Alice", "alice@example.com");
        const identity = await contract.connect(user1).getIdentity(user1.address);
        expect(identity.name).to.equal("Alice");
        expect(identity.email).to.equal("alice@example.com");
        expect(identity.isVerified).to.equal(false);
        expect(identity.exists).to.equal(true);
    });

    it("Should allow a user to update their own identity", async function () {
        await contract.connect(user1).addIdentity("Alice", "alice@example.com");
        await contract.connect(user1).updateIdentity("Alice Updated", "aliceupdated@example.com");
        const identity = await contract.connect(user1).getIdentity(user1.address);
        expect(identity.name).to.equal("Alice Updated");
        expect(identity.email).to.equal("aliceupdated@example.com");
    });

    it("Should allow a user to delete their own identity", async function () {
        await contract.connect(user1).addIdentity("Alice", "alice@example.com");
        await contract.connect(user1).deleteIdentity();
        await expect(contract.connect(user1).getIdentity(user1.address)).to.be.revertedWith("Identity does not exist");
    });

    it("Should allow a user to verify their own identity", async function () {
        await contract.connect(user1).addIdentity("Alice", "alice@example.com");
        await contract.connect(user1).verifyIdentity();
        const identity = await contract.connect(user1).getIdentity(user1.address);
        expect(identity.isVerified).to.equal(true);
    });

    it("Should allow a user to revoke their own identity", async function () {
        await contract.connect(user1).addIdentity("Alice", "alice@example.com");
        await contract.connect(user1).verifyIdentity();
        await contract.connect(user1).revokeIdentity();
        const identity = await contract.connect(user1).getIdentity(user1.address);
        expect(identity.isVerified).to.equal(false);
    });

    it("Should not allow a user to add an identity that already exists", async function () {
        await contract.connect(user1).addIdentity("Alice", "alice@example.com");
        await expect(contract.connect(user1).addIdentity("Alice", "alice@example.com")).to.be.revertedWith("Identity already exists");
    });

    it("Should not allow a user to update an identity that does not exist", async function () {
        await expect(contract.connect(user1).updateIdentity("Alice", "alice@example.com")).to.be.revertedWith("Identity does not exist");
    });

    it("Should not allow a user to delete an identity that does not exist", async function () {
        await expect(contract.connect(user1).deleteIdentity()).to.be.revertedWith("Identity does not exist");
    });

    it("Should not allow a user to verify an identity that does not exist", async function () {
        await expect(contract.connect(user1).verifyIdentity()).to.be.revertedWith("Identity does not exist");
    });

    it("Should not allow a user to revoke an identity that does not exist", async function () {
        await expect(contract.connect(user1).revokeIdentity()).to.be.revertedWith("Identity does not exist");
    });
});
