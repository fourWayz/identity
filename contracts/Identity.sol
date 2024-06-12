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
    address public admin;

    enum Role { User, Admin, Verifier }
    mapping(address => Role) public roles;

    event IdentityAdded(address indexed user, string name, string email);
    event IdentityUpdated(address indexed user, string name, string email);
    event IdentityDeleted(address indexed user);
    event IdentityVerified(address indexed user);
    event IdentityRevoked(address indexed user);
    event RoleAssigned(address indexed account, Role role);
    event IdentityActionLogged(string action);

    modifier onlyAdmin() {
        require(roles[msg.sender] == Role.Admin, "Only admin can perform this action");
        _;
    }

    modifier onlyVerifier() {
        require(roles[msg.sender] == Role.Verifier, "Only verifier can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
        roles[msg.sender] = Role.Admin;
        emit RoleAssigned(msg.sender, Role.Admin);
    }

    function assignRole(address account, Role role) public onlyAdmin {
        roles[account] = role;
        emit RoleAssigned(account, role);
    }

    function addIdentity(address _user, string memory _name, string memory _email) public onlyAdmin {
        require(!identities[_user].exists, "Identity already exists");
        identities[_user] = Identity({
            user: _user,
            name: _name,
            email: _email,
            isVerified: false,
            exists: true
        });
        emit IdentityAdded(_user, _name, _email);
        logIdentityAction("Identity Added");
    }

    function updateIdentity(address _user, string memory _name, string memory _email) public onlyAdmin {
        require(identities[_user].exists, "Identity does not exist");
        identities[_user].name = _name;
        identities[_user].email = _email;
        emit IdentityUpdated(_user, _name, _email);
        logIdentityAction("Identity Updated");
    }

    function deleteIdentity(address _user) public onlyAdmin {
        require(identities[_user].exists, "Identity does not exist");
        delete identities[_user];
        emit IdentityDeleted(_user);
        logIdentityAction("Identity Deleted");
    }

    function verifyIdentity(address _user) public onlyVerifier {
        require(identities[_user].exists, "Identity does not exist");
        identities[_user].isVerified = true;
        emit IdentityVerified(_user);
        logIdentityAction("Identity Verified");
    }

    function revokeIdentity(address _user) public onlyAdmin {
        require(identities[_user].exists, "Identity does not exist");
        identities[_user].isVerified = false;
        emit IdentityRevoked(_user);
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
