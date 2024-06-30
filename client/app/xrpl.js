"use client"

const { useState } = require('react');
const xrpl = require('xrpl');

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233'); // Testnet URL
let xrplAddress;
// Utility function to validate XRPL address
function isValidXrplAddress(address) {
    return xrpl.isValidClassicAddress(address);
}

// Function to store identity data on XRPL
async function storeIdentityOnXRPL(account, identityData) {
    try {
        await client.connect();

        const wallet = xrpl.Wallet.fromSeed('sEd757HjQzMr4Fevze9UzVyaM4XfxWJ'); // your wallet's secret
        const destination = wallet.classicAddress; // Using the same address as both sender and receiver for simplicity

        if (!isValidXrplAddress(destination)) {
            throw new Error('Invalid XRPL destination address');
        }

        xrplAddress =destination
        const currentLedger = await client.getLedgerIndex();
        const futureLedgerSequence = currentLedger + 50; // Setting a higher future ledger sequence

        const transactionBlob = {
            TransactionType: "Payment",
            Account: wallet.classicAddress,
            Amount: "1000000", // 1 XRP in drops
            Destination: destination,
            LastLedgerSequence: futureLedgerSequence,
            Memos: [
                {
                    Memo: {
                        MemoType: xrpl.convertStringToHex('identity'),
                        MemoData: xrpl.convertStringToHex(JSON.stringify({ account, ...identityData })),
                    }
                }
            ]
        };

        const prepared = await client.autofill(transactionBlob);
        const signed = wallet.sign(prepared);
        
        const result = await submitAndWaitWithRetry(signed.tx_blob);
                // Fetch the transaction by hash to verify the memo
                const fetchedTx = await client.request({
                    command: 'tx',
                    transaction: signed.hash
                });
        
                console.log('Fetched Transaction:', fetchedTx); // Log 
        await client.disconnect();

        return result;
    } catch (error) {
        console.error('Error storing identity on XRPL:', error);
        throw error;
    }
}

// Helper function to submit and wait with retry logic
async function submitAndWaitWithRetry(tx_blob, retries = 1) {
    for (let i = 0; i < retries; i++) {
        try {
            const latestLedger = await client.getLedgerIndex();
            const submission = await client.submit(tx_blob);

            // Wait for the transaction to be validated
            const result = await client.request({
                command: 'tx',
                transaction: submission.result.tx_json.hash
            });

            return result
        } catch (error) {
            console.error('Error during transaction submission or validation:', error);
            if (i === retries - 1) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

// Function to get identity data from XRPL
async function getIdentityFromXRPL(account) {
    try {
        await client.connect();
        const wallet = xrpl.Wallet.fromSeed('sEd757HjQzMr4Fevze9UzVyaM4XfxWJ'); // wallet's secret
        xrplAddress =destination

        const response = await client.request({
            command: 'account_tx',
            account: wallet.classicAddress,
            ledger_index_min: -1,
            ledger_index_max: -1,
            limit: 50,
        });

        console.log(response)   

        await client.disconnect();
        if (response.result.transactions) {
            return true
        }
        else{
            return null
        }

        // const identityTx = response.result.transactions.find(tx => tx.tx.Memos && tx.tx.Memos.some(memo => memo.Memo.MemoType === xrpl.convertStringToHex('identity')));
        // if (identityTx) {
        //     const memoData = identityTx.tx.Memos.find(memo => memo.Memo.MemoType === xrpl.convertStringToHex('identity')).Memo.MemoData;
        //     const identity = JSON.parse(xrpl.convertHexToString(memoData));
        //     if (identity.account === account) {
        //         return identity;
        //     }
        // }
        return null;
    } catch (error) {
        console.error('Error getting identity from XRPL:', error);
        throw error;
    }
}

// Function to verify identity on XRPL
async function verifyIdentityOnXRPL(account) {
    try {
        const identityData = await getIdentityFromXRPL(account);
        return identityData !== null;
    } catch (error) {
        console.error('Error verifying identity on XRPL:', error);
        throw error;
    }
}

// Function to log identity action on XRPL
async function logIdentityActionOnXRPL(action) {
    try {
        await client.connect();

        const wallet = xrpl.Wallet.fromSeed('sEd757HjQzMr4Fevze9UzVyaM4XfxWJ'); // wallet's secret
        const destination = wallet.classicAddress; // Using the same address as both sender and receiver for simplicity

        if (!isValidXrplAddress(destination)) {
            throw new Error('Invalid XRPL destination address');
        }

        const currentLedger = await client.getLedgerIndex();
        const futureLedgerSequence = currentLedger + 50; // Setting a higher future ledger sequence

        const transactionBlob = {
            TransactionType: "Payment",
            Account: wallet.classicAddress,
            Amount: "1000000", // 1 XRP in drops
            Destination: destination,
            LastLedgerSequence: futureLedgerSequence,
            Memos: [
                {
                    Memo: {
                        MemoType: xrpl.convertStringToHex('action'),
                        MemoData: xrpl.convertStringToHex(action),
                    }
                }
            ]
        };

        const prepared = await client.autofill(transactionBlob);
        const signed = wallet.sign(prepared);
        
        const result = await submitAndWaitWithRetry(signed.tx_blob);
        await client.disconnect();
        // console.log(result)
        return result;
    } catch (error) {
        console.error('Error logging identity action on XRPL:', error);
        throw error;
    }
}

module.exports = {
    storeIdentityOnXRPL,
    getIdentityFromXRPL,
    verifyIdentityOnXRPL,
    logIdentityActionOnXRPL,
    xrplAddress
};
