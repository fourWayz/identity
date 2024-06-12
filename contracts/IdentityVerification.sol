// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdentityVerification {
    struct Identity {
        address user;
        string name;
        string email;
        bool isVerified;
        bool exists;
    }

    mapping(address => Identity) public identities;

    event IdentityAdded(address indexed user, string name, string email);
    event IdentityUpdated(address indexed user, string name, string email);
    event IdentityDeleted(address indexed user);
    event IdentityVerified(address indexed user);
    event IdentityRevoked(address indexed user);
    event IdentityActionLogged(string action);

    function addIdentity(string memory _name, string memory _email) public {
        require(!identities[msg.sender].exists, "Identity already exists");
        identities[msg.sender] = Identity({
            user: msg.sender,
            name: _name,
            email: _email,
            isVerified: false,
            exists: true
        });
        emit IdentityAdded(msg.sender, _name, _email);
        logIdentityAction("Identity Added");
    }

    function updateIdentity(string memory _name, string memory _email) public {
        require(identities[msg.sender].exists, "Identity does not exist");
        identities[msg.sender].name = _name;
        identities[msg.sender].email = _email;
        emit IdentityUpdated(msg.sender, _name, _email);
        logIdentityAction("Identity Updated");
    }

    function deleteIdentity() public {
        require(identities[msg.sender].exists, "Identity does not exist");
        delete identities[msg.sender];
        emit IdentityDeleted(msg.sender);
        logIdentityAction("Identity Deleted");
    }

    function verifyIdentity() public {
        require(identities[msg.sender].exists, "Identity does not exist");
        identities[msg.sender].isVerified = true;
        emit IdentityVerified(msg.sender);
        logIdentityAction("Identity Verified");
    }

    function revokeIdentity() public {
        require(identities[msg.sender].exists, "Identity does not exist");
        identities[msg.sender].isVerified = false;
        emit IdentityRevoked(msg.sender);
        logIdentityAction("Identity Revoked");
    }

    function getIdentity(address _user) public view returns (Identity memory) {
        require(identities[_user].exists, "Identity does not exist");
        return identities[_user];
    }

    function isIdentityVerified(address _user) public view returns (bool) {
        require(identities[_user].exists, "Identity does not exist");
        return identities[_user].isVerified;
    }

    function logIdentityAction(string memory action) internal {
        emit IdentityActionLogged(action);
    }
}
