# Identity Verification DApp

## Description

This project is a decentralized application (DApp) for identity verification built on the Sepolia blockchain and the XRP Ledger. It allows users to submit, update, verify, and revoke their identities in a secure and decentralized manner. The application leverages smart contracts to manage identity information and interactions, ensuring data integrity and security.

## Features

- **Submit Identity:** Users can submit their identity information, including name and email.
- **Update Identity:** Users can update their existing identity information.
- **Verify Identity:** Users can verify their identity, marking it as authenticated.
- **Revoke Identity:** Users can revoke their identity, marking it as no longer valid.
- **XRPL Integration:** Identities are also stored on the XRP Ledger for additional verification and logging.

## Technologies Used

### Front-End
- Next js
- Bootstrap
- React-Toastify

### Blockchain and Smart Contracts
- Solidity
- Hardhat
- Ethers.js

### XRPL (XRP Ledger)
- XRPL.js


### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/fourWayz/identity/identity.git
   cd identity
   ```

2. Install dependencies:
   ```sh
   yarn install
   ```
   cd client and run:
      ```sh
   npm install
   ```
   

4. Compile the smart contracts:
   ```sh
   truffle compile
   ```

6. Start the React application:
   ```sh
   npm run dev
   ```

### Usage

1. Open the application in your browser.
2. Connect your MetaMask wallet.
3. Submit, update, verify, or revoke your identity as needed.
4. Check your identity status and details in the application interface.

## Smart Contracts

The smart contracts for managing identities are located in the `contracts` directory. Key functionalities include:

- **addIdentity:** Adds a new identity.
- **updateIdentity:** Updates an existing identity.
- **deleteIdentity:** Deletes an existing identity.
- **verifyIdentity:** Marks an identity as verified.
- **revokeIdentity:** Marks an identity as revoked.
- **getIdentity:** Retrieves the identity information for a given user.
- **isIdentityVerified:** Checks if an identity is verified.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
