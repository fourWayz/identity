const xrpl = require('xrpl');

// Initialize client

const xrplClient = new xrpl.Client('wss://s.altnet.rippletest.net:51233');

export async function storeIdentityOnXRPL(identity) {
    const wallet = xrpl.Wallet.fromSeed('sEdTjk7MtUauiKBmbus2hng2urDuiqH');
    await xrplClient.connect();

    const transaction = {
        TransactionType: 'AccountSet',
        Account: wallet.classicAddress,
        Domain: xrpl.convertStringToHex(identity)
    };

    const prepared = await xrplClient.autofill(transaction);
    const signed = wallet.sign(prepared);
    const result = await xrplClient.submitAndWait(signed.tx_blob);

    await xrplClient.disconnect();
    return result;
}

export async function getIdentityFromXRPL(account) {
    await xrplClient.connect();
    const accountInfo = await xrplClient.request({
        command: 'account_info',
        account: account
    });
    await xrplClient.disconnect();
    return xrpl.convertHexToString(accountInfo.result.account_data.Domain);
}

export async function verifyIdentityOnXRPL(account) {
    await xrplClient.connect();
    const accountInfo = await xrplClient.request({
        command: 'account_info',
        account: account
    });
    await xrplClient.disconnect();
    return accountInfo.result.account_data.Domain !== null;
}

export async function logIdentityActionOnXRPL(action) {
    const wallet = xrpl.Wallet.fromSeed('your_xrpl_seed');
    await xrplClient.connect();

    const transaction = {
        TransactionType: 'Payment',
        Account: wallet.classicAddress,
        Amount: xrpl.xrpToDrops('0.00001'),
        Destination: 'rXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        InvoiceID: xrpl.convertStringToHex(action)
    };

    const prepared = await xrplClient.autofill(transaction);
    const signed = wallet.sign(prepared);
    const result = await xrplClient.submitAndWait(signed.tx_blob);

    await xrplClient.disconnect();
    return result;
}
